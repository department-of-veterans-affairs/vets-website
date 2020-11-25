/* eslint-disable no-console */

const crypto = require('crypto');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');

// Mapping of file paths (relative to a build path) to an array of hashes where
// the indices correspond to the position of the build in the list of arguments
// for the script. For example, the hashes for a file from two builds:
// 'a/file/path': ['abcdef', '123456']
const fileHashes = {};

const calculateFileHash = filePath => {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
};

const collectFileHashes = (dirPath, buildIndex) => {
  fs.readdirSync(dirPath).forEach(fileName => {
    const filePath = path.join(dirPath, fileName);

    if (fs.statSync(filePath).isDirectory()) {
      collectFileHashes(filePath, buildIndex);
    } else if (fileName.endsWith('.html')) {
      if (!fileHashes[filePath]) fileHashes[filePath] = [];
      fileHashes[filePath][buildIndex] = calculateFileHash(filePath);
    }
  });
};

const isDomEqual = async (filePath, buildPaths) => {
  const domPromises = buildPaths.map(
    async buildPath =>
      (await JSDOM.fromFile(path.join(buildPath, filePath))).window.document
        .documentElement,
  );
  const doms = await Promise.all(domPromises);
  return doms.reduce((acc, cur) => (acc.isEqualNode(cur) ? acc : null));
};

const compareBuilds = async (buildPaths = []) => {
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

  // let hashDiffCount = 0;
  // let domDiffCount = 0;

  // Filter file hashes by pages that differ.
  for (const [filePath, hashes] of Object.entries(fileHashes)) {
    const isContentEqual = hashes.reduce(
      (acc, hash) => (acc === hash ? acc : false),
    );

    if (!isContentEqual) {
      // hashDiffCount++;

      // Confirm inequality by checking that the page isn't unique
      // to a single build and then comparing that page's DOMs between builds.
      const shouldLogDiff =
        hashes.filter(Boolean).length === 1 ||
        !(await isDomEqual(filePath, buildPaths)); // eslint-disable-line no-await-in-loop

      if (shouldLogDiff) {
        // domDiffCount++;
        diffHashes[filePath] = {};
        hashes.forEach((hash, index) => {
          diffHashes[filePath][buildPaths[index]] = hash || null;
        });
      }
    }
  }

  // console.log('hashDiffCount');
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
