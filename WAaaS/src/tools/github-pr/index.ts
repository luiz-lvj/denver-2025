import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolCategory } from "../../registry/types";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

// Create the GitHub PR tool
export const githubPr = tool(
  async ({ title, description, baseBranch, newBranch, repo, filePath, fileContent, commitMessage }) => {
    try {
      // Initialize Octokit with GitHub token
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      });

      // Extract owner and repo from the repo string
      const [owner, repoName] = repo.split('/');

      // 1. Get the latest commit SHA from the base branch
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo: repoName,
        ref: `heads/${baseBranch}`
      });
      const baseSha = refData.object.sha;

      // 2. Create a new branch based on the base branch
      await octokit.git.createRef({
        owner,
        repo: repoName,
        ref: `refs/heads/${newBranch}`,
        sha: baseSha
      });

      // 3. Create or update file in the new branch
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(fileContent).toString('base64'),
        branch: newBranch
      });

      // 4. Create a pull request
      const { data: prData } = await octokit.pulls.create({
        owner,
        repo: repoName,
        title,
        body: description,
        head: newBranch,
        base: baseBranch
      });

      return `Successfully created PR #${prData.number}: "${title}"\nPR URL: ${prData.html_url}`;
    } catch (error: any) {
      return `Error creating GitHub PR: ${error.message}`;
    }
  },
  {
    name: "github_pr",
    description: "Create a GitHub pull request for adding or modifying files",
    schema: z.object({
      title: z.string().describe("The title of the PR"),
      description: z.string().describe("Description of the PR and changes"),
      baseBranch: z.string().describe("The base branch (usually 'main' or 'master')"),
      newBranch: z.string().describe("The new branch name where changes will be made"),
      repo: z.string().describe("Repository name (format: 'owner/repo')"),
      filePath: z.string().describe("Path to the file to be created or modified"),
      fileContent: z.string().describe("Content of the file"),
      commitMessage: z.string().describe("Commit message for the changes")
    })
  }
);

// Export metadata separately
export const metadata = {
  category: ToolCategory.UTILITY,
  description: "Creates GitHub pull requests for adding new tools or making other changes",
  usage: "github_pr({ title, description, baseBranch, newBranch, repo, filePath, fileContent, commitMessage })",
  examples: [
    `github_pr({
      title: 'Add new weather tool',
      description: 'This PR adds a new weather tool that supports more detailed forecasts',
      baseBranch: 'main',
      newBranch: 'feature/new-weather-tool',
      repo: 'username/repo-name',
      filePath: 'src/tools/advanced-weather/index.ts',
      fileContent: '// Tool implementation code...',
      commitMessage: 'Add advanced weather tool'
    })`,
    `github_pr({
      title: 'Fix token balance tool',
      description: 'This PR fixes an issue with the token balance tool',
      baseBranch: 'main',
      newBranch: 'fix/token-balance-issue',
      repo: 'username/repo-name',
      filePath: 'src/tools/get-token-balance/index.ts',
      fileContent: '// Updated implementation...',
      commitMessage: 'Fix token balance calculation'
    })`
  ],
}; 