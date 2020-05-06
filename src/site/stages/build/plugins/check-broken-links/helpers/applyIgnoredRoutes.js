function _getReactLandingPages(files) {
  return Object.keys(files)
    .map(fileName => files[fileName])
    .filter(file => !!file.entryname)
    .map(file => `/${file.path}`);
}

function isAspPage(target) {
  return target ? target.endsWith('.asp') : false;
}

function isReactPage(reactLandingPages, target) {
  if (!target) return false;
  return reactLandingPages.some(reactPath => target.startsWith(reactPath));
}

/**
 * Filters out certain links detected as broken that meet special circumstances.
 * @param {Array} brokenPages
 * @param {Object} files Metalsmith files data
 */
function applyIgnoredRoutes(
  brokenPages,
  files,
  getReactLandingPages = _getReactLandingPages,
) {
  // We ignore React landing pages, because React apps have
  // dynamic, client-side routing and only the root page
  // will have an HTML page.

  // We also ignore pages ending in .asp, because although those
  // pages are under the same domain, they are not part of our
  // source code, so we can't validate them.

  const reactLandingPages = getReactLandingPages(files);

  return brokenPages
    .map(brokenPage => {
      const filteredLinkErrors = brokenPage.linkErrors
        .filter(linkError => !isAspPage(linkError.target))
        .filter(linkError => !isReactPage(reactLandingPages, linkError.target));

      return {
        ...brokenPage,
        linkErrors: filteredLinkErrors,
      };
    })

    .filter(brokenPage => brokenPage.linkErrors.length > 0);
}

module.exports = applyIgnoredRoutes;
module.exports.getReactLandingPages = _getReactLandingPages;
