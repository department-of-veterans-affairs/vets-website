const fs = require('fs');
const path = require('path');

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
  .map(app => {
    try {
      const files = fs.readdirSync(`${app.directory}`);

      if (files.includes('manifest.json')) {
        const file = JSON.parse(
          fs.readFileSync(`${app.directory}/manifest.json`),
        );

        return { owner: app.owner, appName: file.entryName };
      }

      return app;
    } catch (err) {
      return app;
    }
  })
  .filter(app => !!app.appName);

process.stdout.write(JSON.stringify(appOwnerMap));
