const path = require('path');
const url = require('url');

function isBrokenLink(link, pagePath, allPaths) {
  if (!link) return true;

  const parsed = url.parse(link);
  const isExternal = !!parsed.protocol;

  if (isExternal) return false;

  if (!parsed.pathname) {
    // Not empty, not external, but also no path.
    // This has to be an hash link or query param change.

    return false;
  }

  let filePath = decodeURI(parsed.pathname);

  if (path.isAbsolute(filePath)) {
    filePath = path.join('.', filePath);
  } else {
    filePath = path.join(pagePath, filePath);
  }

  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  return !allPaths.has(filePath);
}

module.exports = isBrokenLink;
