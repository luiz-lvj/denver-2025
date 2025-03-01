import { z } from "zod";
import { WaaaSAction } from "../types";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

// Define the schema for the GitHub PR tool
export const GitHubPRSchema = z.object({
  title: z.string().describe("The title of the PR"),
  description: z.string().describe("Description of the PR and changes"),
  baseBranch: z.string().describe("The base branch (usually 'main' or 'master')"),
  newBranch: z.string().describe("The new branch name where changes will be made"),
  repo: z.string().describe("Repository name (format: 'owner/repo')"),
  filePath: z.string().describe("Path to the file to be created or modified"),
  fileContent: z.string().describe("Content of the file"),
  commitMessage: z.string().describe("Commit message for the changes")
}).strict();

// Create the implementation function
async function githubPrFunc(
  args: z.infer<typeof GitHubPRSchema>
): Promise<string> {
  const { title, description, baseBranch, newBranch, repo, filePath, fileContent, commitMessage } = args;
  
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
}

// The PR tool description
const GITHUB_PR_PROMPT = `
This tool creates GitHub pull requests for adding or modifying files in a repository.

Required inputs:
- title: The title of the PR
- description: Description of the PR and changes
- baseBranch: The base branch (usually 'main' or 'master')
- newBranch: The new branch name where changes will be made
- repo: Repository name (format: 'owner/repo')
- filePath: Path to the file to be created or modified
- fileContent: Content of the file
- commitMessage: Commit message for the changes

Important notes:
- Requires a valid GitHub token to be set as GITHUB_TOKEN in the environment
- Creates a new branch, commits the file, and opens a PR
- Returns the PR number and URL when successful
`;

// Export the GitHub PR action
export const githubPrAction: WaaaSAction<typeof GitHubPRSchema> = {
  name: "github_pr",
  description: GITHUB_PR_PROMPT,
  schema: GitHubPRSchema,
  func: githubPrFunc
}; 