const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Modeled after https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      /* eslint-disable no-param-reassign */
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
    }
  });

  return arrayOfFiles;
}

/**
 * Writes the array of filenames & hashes to a file
 */
function writeArrayToFile(arr, outputFile) {
  const file = fs.createWriteStream(outputFile);
  file.on('error', err => {
    /* error handling */
    throw err;
  });

  arr.forEach(({ filename, hash }) => {
    file.write(`${hash} ${filename}\n`);
  });
  file.end();
}

/**
 * Hash all of the build files in the outputDir and create a file
 * listing the hash for each build file
 */
function hashBuildOutput(outputDir, hashFile) {
  // Get only the HTML build files
  const buildFiles = getAllFiles(outputDir).filter(
    filename => filename.split('.').slice(-1)[0] === 'html',
  );

  const fileHashes = buildFiles.map(filename => {
    const data = fs.readFileSync(filename, { encoding: 'utf8' });
    const hash = crypto.createHash('md5');
    hash.update(data);

    const relativeFilename = path.relative(outputDir, filename);

    return { filename: relativeFilename, hash: hash.digest('hex') };
  });

  writeArrayToFile(fileHashes, hashFile);
  // return fileHashes;
}

function compareBuilds() {
  hashBuildOutput('../build/localhost', 'buildOutput.txt');
  hashBuildOutput('../../content-build/build/localhost', 'buildOutput2.txt');
}

compareBuilds();
