/* eslint-disable no-param-reassign, no-continue, no-console */
const path = require('path');

function getPagePath(fileName, fileData) {
  const { permalink } = fileData;
  return permalink ? permalink.replace('index.html', '') : `/${fileName.replace('.md', '')}/`;
}

function getRedirectPage(redirectToPath) {
  return `
    <!doctype html>
    <head>
      <meta http-equiv=refresh content="1; url=${redirectToPath}">
      <link rel=canonical href="${redirectToPath}">
      <title>Page Moved</title>
    </head>
    <body>
      New location: <a href="${redirectToPath}">${redirectToPath}</a>
    </body>`;
}

function createRedirects(options) {
  return (files, metalsmith, done) => {

    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const {
        aliases
      } = fileData;

      if (!aliases) continue;

      const redirectToPath = getPagePath(fileName, fileData);
      const redirectPage = {
        contents: new Buffer(getRedirectPage(redirectToPath))
      };

      for (let alias of aliases) {
        if (!path.extname(alias)) alias = path.join(alias, 'index.html');

        alias = path.join(options.destination, alias);
        files[alias] = redirectPage;
      }
    }

    done();
  };
}

module.exports = createRedirects;
