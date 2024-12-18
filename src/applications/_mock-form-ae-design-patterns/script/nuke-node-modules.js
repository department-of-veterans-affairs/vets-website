// disabling rule since this is run in node and not in browser
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const createSpinner = require('./spinner');

/**
 * find all node_modules directories in a directory
 * @param {string} dir - directory to search for node_modules
 * @returns {string[]} array of paths to node_modules directories that were found
 */
const findNodeModules = dir => {
  try {
    const results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (item === 'node_modules') {
          results.push(fullPath);
        } else if (!fullPath.includes('node_modules')) {
          // Don't search inside other node_modules directories
          results.push(...findNodeModules(fullPath));
        }
      }
    }

    return results;
  } catch (err) {
    console.error(`Error searching directory ${dir}:`, err);
    return [];
  }
};

/**
 * confirm deletion of node_modules directories
 * @param {string[]} folders - array of paths to node_modules directories
 * @returns {Promise<boolean>} resolves to true if confirmed deletion, false otherwise
 */
const confirmDeletion = async folders => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Found these node_modules folders:');
  folders.forEach(folder => console.log(folder));

  return new Promise(resolve => {
    rl.question(
      'Are you sure you want to delete these directories? (Y/N) ',
      answer => {
        rl.close();
        resolve(answer.toLowerCase() === 'y');
      },
    );
  });
};

/**
 * delete all node_modules directories in a directory
 * @param {string} startDir - directory to search for node_modules
 */
const deleteNodeModules = async (startDir = '.') => {
  try {
    const foundDirs = findNodeModules(startDir);

    if (foundDirs.length === 0) {
      console.log('No node_modules directories found.');
      return;
    }

    const confirmed = await confirmDeletion(foundDirs);

    if (confirmed) {
      const spinner = createSpinner('Deleting node_modules directories...');
      await Promise.all(
        foundDirs.map(dir => {
          console.log(`Deleted ${dir}`);
          return fs.remove(dir);
        }),
      );
      spinner.stop('Deletion complete.');
    } else {
      console.log('Operation cancelled.');
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

// Get directory from command line argument or use current directory
const targetDir = process.argv[2] || '.';
deleteNodeModules(targetDir);
