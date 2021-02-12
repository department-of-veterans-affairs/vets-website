/* eslint-disable no-console */

const crypto = require('crypto');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const { runCommandSync } = require('../utils');

// Mapping of file paths (relative to a build path) to an array of hashes where
// the indices correspond to the position of the build in the list of arguments
// for the script. For example, the hashes for a file from two builds:
// 'a/file/path': ['abcdef', '123456']
const fileHashes = {};
let jsonDiffPages = [];

/**
 * Calculates MD5 hash for a file.
 * @param {string} filePath - Path to the file
 * @return {string} The file hash.
 */
const calculateFileHash = filePath => {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
};

/**
 * Gathers file hashes for all HTML files in a build directory.
 * Maps file paths to the hashes in a global object.
 * @params {string} dirPath - The build directory path.
 * @params {number} buildIndex - The index of the build from the script args.
 */
const collectFileHashes = (dirPath, buildIndex) => {
  fs.readdirSync(dirPath).forEach(fileName => {
    const filePath = path.join(dirPath, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      collectFileHashes(filePath, buildIndex);
    } else if (
      fileName.endsWith('.html') &&
      jsonDiffPages.includes(`/${filePath}`)
    ) {
      if (!fileHashes[filePath]) fileHashes[filePath] = [];
      fileHashes[filePath][buildIndex] = calculateFileHash(filePath);
    }
  });
};

/**
 * Checks DOM equality between a HTML document from different builds.
 * @params {string} filePath - The file path of the HTML doc.
 * @params {string[]} buildPaths - Array of build directory root paths.
 * @return {boolean} Whether the DOMs are considered equal.
 */
const isDomEqual = async (filePath, buildPaths) => {
  const domPromises = buildPaths.map(
    async buildPath =>
      (await JSDOM.fromFile(path.join(buildPath, filePath))).window.document
        .documentElement,
  );
  const doms = await Promise.all(domPromises);
  return doms.reduce((acc, cur) => (acc.isEqualNode(cur) ? acc : null));
};

/**
 * Compares builds given a list of builds. Writes a mapping of file paths
 * to hashes per build for all HTML files, then writes a separate mapping
 * only for hashes that differ.
 * @param {string} buildPaths - Array of paths to build directories.
 */
const compareBuilds = async (buildPaths = []) => {
  const pagesWithDiffsFile = 'content-object-diffs/pages-with-diffs.json';

  if (!fs.existsSync(pagesWithDiffsFile)) {
    console.log('Running JSON diff tool.');
    runCommandSync('yarn cms:diff:json --html');
  }

  const jsonDiffList = JSON.parse(fs.readFileSync(pagesWithDiffsFile));
  jsonDiffPages = Object.keys(jsonDiffList);

  const outputDir = 'comparison-output';
  const allHashesFile = path.join(outputDir, 'all-hashes.json');
  const diffHashes = {};

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log(`Created output directory at ${outputDir}`);
  }

  if (!fs.existsSync(allHashesFile)) {
    console.log('Collecting hashes for all content pages.');
    const currentPath = process.cwd();

    buildPaths.forEach((buildPath, index) => {
      process.chdir(buildPath);
      collectFileHashes('.', index);
      process.chdir(currentPath);
    });

    fs.writeFileSync(
      allHashesFile,
      JSON.stringify(fileHashes, null, 2),
      'utf8',
    );
    console.log(`Wrote hashes out to ${allHashesFile}.`);
  } else {
    Object.assign(fileHashes, JSON.parse(fs.readFileSync(allHashesFile)));
    console.log(`Found existing hashes output at ${allHashesFile}.`);
    console.log(`Diffs will be based on existing hashes output.`);
  }

  let hashDiffCount = 0;
  // let domDiffCount = 0;

  // Filter file hashes by pages that differ.
  for (const [filePath, hashes] of Object.entries(fileHashes)) {
    const isContentEqual = hashes.reduce(
      (acc, hash) => (acc === hash ? acc : false),
    );

    if (!isContentEqual) {
      hashDiffCount++;

      // Confirm inequality by checking that the page isn't unique
      // to a single build and then comparing that page's DOMs between builds.
      const shouldLogDiff =
        hashes.filter(Boolean).length === 1 ||
        !(await isDomEqual(filePath, buildPaths)); // eslint-disable-line no-await-in-loop

      if (shouldLogDiff) {
        // domDiffCount++;
        diffHashes[filePath] = {
          deepDiff: jsonDiffList[`/${filePath}`].deepDiff,
          arrayDiff: jsonDiffList[`/${filePath}`].arrayDiff,
          hashes: {},
        };

        hashes.forEach((hash, index) => {
          diffHashes[filePath].hashes[buildPaths[index]] = hash || null;
        });
      }
    }
  }

  console.log('Pages with hash diffs:', hashDiffCount);
  // console.log(hashDiffCount);
  // console.log('domDiffCount');
  // console.log(domDiffCount);

  if (Object.keys(diffHashes).length) {
    const diffHashesFile = path.join(outputDir, 'diff-hashes.json');
    fs.writeFileSync(
      diffHashesFile,
      JSON.stringify(diffHashes, null, 2),
      'utf8',
    );
    console.log(`Wrote diffed hashes to ${diffHashesFile}.`);
  }
};

compareBuilds(process.argv.slice(2));
