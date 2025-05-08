#!/usr/bin/env node

/* eslint-disable no-console */
const fs = require('fs').promises;
const path = require('path');

// src/applications/686c-674*/**/{*.js,*.jsx}
// VS Code search helpers
// {*.js,*.jsx}: Search all files with .js or .jsx extension
// 686c-674*/**/: Recursively search in all directories starting from 686c-674 or 686c-674-v1

// At the top of the script, add a constant for the workspace prefix
const MAPPINGS_FILE = path.resolve(__dirname, './mappings.json');
const WORKSPACE_PREFIX = '@department-of-veterans-affairs/';
const DIR_PREFIX = 'platform';

// Function to replace capture groups with $n
function replaceWithGroupNumbers(pattern) {
  let groupCount = 0;
  return pattern.replace(/\((?!\?)\w*[^)]*\)/g, match => {
    // Count only non-named capture groups
    if (!match.includes('?<')) {
      groupCount += 1;
      return `$${groupCount}`;
    }
    return match;
  });
}

// Function to load mappings from JSON file
async function loadMappings(filePath = MAPPINGS_FILE) {
  // Flatten the nested structure into a single Map
  const flattened = new Map();

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const mappings = JSON.parse(content);

    Object.entries(mappings).forEach(([dir, entries]) => {
      const WORKSPACE_SUBPREFIX = `${DIR_PREFIX}-${dir}`;
      const DIR = `${DIR_PREFIX}/${dir}`;

      flattened.set(DIR, WORKSPACE_SUBPREFIX);

      for (const [key, value] of Object.entries(entries)) {
        const newKey = `${DIR_PREFIX}/${dir}/${key}`;

        if (value === '*') {
          flattened.set(newKey, `${WORKSPACE_SUBPREFIX}/${key}`);
        } else if (/^<+$/.test(value)) {
          const splitValue = key.split('/');
          const newValue = replaceWithGroupNumbers(
            splitValue.slice(-value.length).join('/'),
          );
          flattened.set(newKey, `${WORKSPACE_SUBPREFIX}/${newValue}`);
        } else if (/^>+$/.test(value)) {
          const splitValue = key.split('/');
          const newValue = splitValue.slice(0, value.length).join('/');
          flattened.set(newKey, `${WORKSPACE_SUBPREFIX}/${newValue}`);
        } else {
          flattened.set(newKey, `${WORKSPACE_SUBPREFIX}/${value}`);
        }
      }
    });

    console.log(flattened);

    return flattened;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Could not find mappings file at ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in mappings file: ${error.message}`);
    } else {
      console.error(`Error loading mappings: ${error.message}`);
    }
    process.exit(1); // Exit with non-zero status
  }

  return flattened;
}

// Get root path from command line arguments
function getRootPath() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: Please specify a directory');
    process.exit(1);
  }

  return path.resolve(process.cwd(), args[0]);
}

async function updateImports() {
  const rootDir = getRootPath();
  const importMapping = await loadMappings();

  // Helper function to transform import statements
  const transformImport = line => {
    return Array.from(importMapping.entries()).reduce(
      (currentLine, [oldPath, newPath]) => {
        const platformPattern = `['"](?:~\\/)?platform(.+)['"]`;
        const platformRegex = new RegExp(platformPattern);
        // Match ES6 imports: import { something } from './old/path';
        // console.log(`['"](?:~\\/)?${escapeRegExp(oldPath)}['"]`);

        // We know all imports start with platform or ~platform
        if (!platformRegex.test(currentLine)) return currentLine;
        const pattern = new RegExp(
          `['"](?:~\\/)?${oldPath}(?:\\.jsx?|\\/)?['"]`,
        );

        // Only replace the path part, preserving the rest of the import statement
        const fullNewPath = `${WORKSPACE_PREFIX}${newPath}`;
        return currentLine.replace(pattern, `'${fullNewPath}'`);
      },
      line,
    );
  };

  // Process files recursively
  async function processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile() && /\.(js|jsx)$/.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf8');
        const lines = content.split('\n');

        // Transform imports
        const transformedLines = lines.map(transformImport);

        // Only write file if changes were made
        if (transformedLines.join('\n') !== content) {
          await fs.writeFile(fullPath, transformedLines.join('\n'));
          console.log(`Updated imports in ${fullPath}`);
        }
      }
    }
  }

  // Start processing from root directory
  await processDirectory(rootDir);
}

updateImports()
  .then(() => console.log('Import updating completed successfully'))
  .catch(error => console.error('Error:', error));
