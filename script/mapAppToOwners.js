const fs = require('fs');
const path = require('path');
const glob = require('glob');

const codeOwners = fs.readFileSync(
  path.join(__dirname, '../.github/CODEOWNERS'),
  'utf-8',
);

const mappedLines = codeOwners
  .split(/\n/)
  .map(line => {
    const directory = /(?<directory>\S*)\s@department-of-veterans-affairs\/\S.*$/g.exec(
      line,
    )?.groups?.directory;

    const regex = /\S*\s@department-of-veterans-affairs\/(\S*)/g;
    const matches = [];
    let match = regex.exec(line);

    while (match != null) {
      matches.push(match[1]);
      match = regex.exec(line);
    }

    if (directory && matches.length) {
      return { directory, owner: matches };
    }

    return undefined;
  })
  .filter(line => !!line);

const appOwnerMap = mappedLines
  .reduce((acc, app) => {
    const files = glob.sync(`${app.directory}/**/manifest.json`);
    const apps = [];

    files.forEach(file => {
      const manifest = JSON.parse(fs.readFileSync(file));

      apps.push({ owner: app.owner, appName: manifest.entryName });
    });

    return [...acc, ...apps];
  }, [])
  .filter(app => !!app.appName);

process.stdout.write(JSON.stringify(appOwnerMap));
