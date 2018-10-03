/* eslint-disable no-param-reassign, no-continue */
const path = require('path');

function getRedirectPage(redirectToPath) {
  let absolutePath = `/${redirectToPath}`;
  if (!absolutePath.endsWith('/')) absolutePath += '/';

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
    for (const redirect of options.redirects) {
      const redirectPage = {
        contents: new Buffer(getRedirectPage(redirect.dest.substr(1))),
      };

      let absolutePath = path.join(options.destination, redirect.src);
      if (!path.extname(absolutePath))
        absolutePath = path.join(absolutePath, 'index.html');

      if (files[absolutePath]) {
        // eslint-disable-next-line no-console
        console.warn(`Redirect conflicts with existing page: ${redirect.src}`);
      }

      files[absolutePath] = {
        ...redirectPage,
        path: absolutePath,
      };
    }

    for (const fileName of Object.keys(files)) {
      const fileData = files[fileName];
      const { aliases, path: redirectToPath } = fileData;

      if (!aliases) continue;

      const redirectPage = {
        contents: new Buffer(getRedirectPage(redirectToPath)),
      };

      for (const alias of aliases) {
        let absolutePath = path.join(options.destination, alias);
        if (!path.extname(absolutePath))
          absolutePath = path.join(absolutePath, 'index.html');

        files[absolutePath] = {
          ...redirectPage,
          path: absolutePath,
        };
      }
    }

    done();
  };
}

module.exports = createRedirects;
