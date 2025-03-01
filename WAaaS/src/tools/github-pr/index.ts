import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { githubPrAction } from "./action";

// Create the tool with wrapper
export const githubPr = createWaaaSTool(githubPrAction, {
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
  ]
});

// Export metadata separately for compatibility with existing registry
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
  ]
}; 