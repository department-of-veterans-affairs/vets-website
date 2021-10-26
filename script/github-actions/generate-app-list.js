const fs = require('fs');
const glob = require('glob');
const core = require('@actions/core');

function findAllManifests() {
  const applicationList = [];
  glob('src/applications/**/manifest.json', function(err, files) {
    files.forEach(file => {
      const manifestData = JSON.parse(fs.readFileSync(file));
      applicationList.push({
        name: manifestData.appName,
        slug: manifestData.entryName,
      });
    });
    core.exportVariable('APPLICATION_LIST', applicationList);
  });
}

findAllManifests();
