/* eslint-disable no-param-reassign, no-continue */
const path = require('path');

function getRedirectPage(redirectToPath) {
  const absolutePath = `/${redirectToPath}/`;
  return `
    <!doctype html>
    <head>
      <meta http-equiv=refresh content="1; url=${absolutePath}">
      <link rel=canonical href="${absolutePath}">
      <title>Page Moved</title>
    </head>
    <body>
      New location: <a href="${absolutePath}">${absolutePath}</a>
    </body>`;
}

function createRedirects(options) {
  return (files, metalsmith, done) => {

    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const {
        aliases,
        path: redirectToPath
      } = fileData;

      if (!aliases) continue;

      const redirectPage = {
        contents: new Buffer(getRedirectPage(redirectToPath))
      };

      for (let alias of aliases) {
        if (!path.extname(alias)) alias = path.join(alias, 'index.html');

        alias = path.join(options.destination, alias);

        files[alias] = {
          ...redirectPage,
          path: alias
        };
      }
    }

    done();
  };
}

module.exports = createRedirects;
