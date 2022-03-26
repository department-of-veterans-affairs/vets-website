/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');

const options = commandLineArgs([
  { name: 'dirs', type: String, defaultOption: true, required: true }, // Comma-delimited string of relative directory paths
  { name: 'glob', type: String, required: true }, // Glob pattern to search for in directories
]);

const folderPaths = options.dirs.split(',');

const filePaths = folderPaths.reduce((fileString, folderPath) => {
  const pattern = `${folderPath}/${options.glob}`;
  const files = glob.sync(pattern);
  return files.length ? `${fileString} ${files.join(' ')}` : fileString;
}, '');

if (!filePaths) {
  process.exit(0);
}

console.log(filePaths);
