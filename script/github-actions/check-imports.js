const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function createDynamicImportRegex(fileName) {
  // Escape special regex characters in the fileName, just in case it has any
  const safeFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern =
    String.raw`import\s+(?:` +
    String.raw`${safeFileName}\s*(?:,\s*\{[^}]*\})?` + // default import
    String.raw`|\{\s*${safeFileName}(?:\s*,\s*[^}]*)?\}` + // named import
    String.raw`)\s+from\s+["'][^"']*${safeFileName}[^"']*["']`;
  return new RegExp(pattern, 'gm');
}

function getFileName(filePath) {
  const fileNameWithExt = filePath.split('/').pop();
  return fileNameWithExt.replace(/\.[^/.]+$/, '');
}
function getDeletedFiles() {
  try {
    const output = execSync('git ls-files --deleted').toString();
    return output.split('\n').filter(Boolean);
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error(':x: Error fetching deleted files:', error);
    return [];
  }
}

// Helper: Efficient Recursive File Scan
function getAllProjectFiles(dir = process.cwd(), fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git') {
        getAllProjectFiles(fullPath, fileList);
      }
    } else if (/\.(js|ts|jsx|tsx)$/.test(file.name)) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}
function checkBrokenImports(deletedFiles) {
  if (deletedFiles.length === 0) return [];
  const allFiles = getAllProjectFiles();

  const importPatterns = deletedFiles.map(file => {
    const fileName = getFileName(file);
    return createDynamicImportRegex(fileName);
  });

  const brokenImports = [];
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    importPatterns.forEach((regex, index) => {
      if (regex.test(content)) {
        brokenImports.push({ file, deletedFile: deletedFiles[index] });
      }
    });
  });
  return brokenImports;
}
// Main Execution
function checkImport() {
  try {
    const deletedFiles = getDeletedFiles();
    if (deletedFiles.length === 0) {
      return;
    }
    const brokenImports = checkBrokenImports(deletedFiles);
    if (brokenImports.length === 0) {
      /* eslint-disable-next-line no-console */
      console.log('No broken imports found.');
    } else {
      brokenImports.forEach(({ file, deletedFile }) => {
        /* eslint-disable-next-line no-console */
        console.warn(`:warning:  ${file} imports deleted file: ${deletedFile}`);
      });
      process.exit(1); // Exit the process with a failure code if broken imports are found.
    }
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error('An error occurred during execution:', error);
    process.exit(1); // Exit the process with a failure code on error.
  }
}
checkImport();
