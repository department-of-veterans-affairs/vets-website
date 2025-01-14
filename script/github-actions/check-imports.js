const { execSync } = require('child_process');

const runCommand = (command, silent = false) => {
  try {
    return execSync(command, { stdio: silent ? 'pipe' : 'inherit' })
      .toString()
      .trim();
  } catch (error) {
    return process.exit(1);
  }
};
const targetBranch = process.argv[2] || 'main';
// Step 1: Get a list of changed files between the current branch and the target branch
const diffCommand = `git diff --name-only ${targetBranch} -- '*.js' '*.jsx' '*.ts' '*.tsx'`;
const changedFiles = runCommand(diffCommand, true)
  .split('\n')
  .filter(Boolean);
if (changedFiles.length === 0) {
  process.exit(0);
}

// Step 2: Run ESLint only on the changed files
const eslintCommand = `npx eslint ${changedFiles.join(' ')}`;
runCommand(eslintCommand);
