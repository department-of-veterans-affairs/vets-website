const path = require('path');
const url = require('url');

/**
 * Validates an HREF/SRC value
 * @param {*} link The HREF/SRC value to be validated.
 * @param {string} pagePath The path of the HTML page containing the link. This is unlikely to be used, but would be used in the case of relative paths in the link.
 * @param {Set<string>} allPaths The paths of all files in the website. Used to confirm the existence of a file.
 */
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
