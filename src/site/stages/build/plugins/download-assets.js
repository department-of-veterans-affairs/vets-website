/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

require('isomorphic-fetch');
const https = require('https');
const fs = require('fs-extra');
const path = require('path');
const decompress = require('decompress');
const buckets = require('../../../constants/buckets');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      })
      .on('error', err => {
        fs.unlink(dest);
        reject(err.message);
      });
  });
}

async function downloadFromLiveBucket(files, buildOptions) {
  const bucket = buckets[buildOptions.buildtype];
  const fileManifestPath = 'generated/file-manifest.json';

  console.log(`Downloading assets from ${bucket}...`);

  const fileManifestRequest = await fetch(`${bucket}/${fileManifestPath}`);
  const fileManifest = await fileManifestRequest.json();

  files[fileManifestPath] = {
    path: fileManifestPath,
    contents: new Buffer(JSON.stringify(fileManifest)),
  };

  const entryNames = Object.keys(fileManifest);

  const downloads = entryNames.map(async entryName => {
    let bundleFileName = fileManifest[entryName];
    const bundleUrl = `${bucket}${bundleFileName}`;
    const bundleResponse = await fetch(bundleUrl);

    if (!bundleResponse.ok) {
      throw new Error(`Failed to download asset: ${bundleUrl}`);
    }

    if (bundleFileName.startsWith('/'))
      bundleFileName = bundleFileName.slice(1);

    files[bundleFileName] = {
      path: bundleFileName,
      contents: await bundleResponse.buffer(),
    };

    console.log(`Successfully downloaded asset: ${bundleUrl}`);
  });

  return Promise.all(downloads);
}

async function downloadFromArchive(files, assetSource, buildtype) {
  const archiveUrl = `https://s3-us-gov-west-1.amazonaws.com/vetsgov-website-builds-s3-upload/${assetSource}/${buildtype}.tar.bz2`;

  const localPath = path.join(__dirname, '../../../../../temp/site.tar.bz2');
  const assetsPath = path.dirname(localPath);

  fs.emptyDirSync(assetsPath);
  await downloadFile(archiveUrl, localPath);
  await decompress(localPath, assetsPath);

  fs.readdirSync(path.join(assetsPath, 'generated')).forEach(file => {
    files[`generated/${file}`] = {
      path: `generated/${file}`,
      contents: fs.readFileSync(path.join(assetsPath, 'generated', file)),
    };
  });
}

function downloadAssets(buildOptions) {
  return async (files, smith, done) => {
    const assetSource = buildOptions['asset-source'];

    if (assetSource === 'deployed') {
      await downloadFromLiveBucket(files, buildOptions);
    } else {
      await downloadFromArchive(files, assetSource, buildOptions.buildtype);
    }

    done();
  };
}

module.exports = downloadAssets;
