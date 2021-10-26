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
    const match = /(?<directory>\S*)\s@department-of-veterans-affairs\/(?<owner>.\S*).*$/g.exec(
      line,
    );

    if (match?.groups?.directory && match.groups.owner) {
      return { directory: match.groups.directory, owner: match.groups.owner };
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
