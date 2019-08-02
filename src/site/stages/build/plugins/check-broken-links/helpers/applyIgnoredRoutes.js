function _getReactLandingPages(files) {
  const reactLandingPages = Object.keys(files)
    .map(fileName => files[fileName])
    .filter(file => !!file.entryname)
    .map(file => `/${file.path}`);

  return reactLandingPages;
}

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

  const filteredBrokenPages = brokenPages
    .map(brokenPage => {
      const filteredLinkErrors = brokenPage.linkErrors
        .filter(linkError => !linkError.target.endsWith('.asp'))
        .filter(
          linkError =>
            !reactLandingPages.some(reactPath =>
              linkError.target.startsWith(reactPath),
            ),
        );

      return {
        ...brokenPage,
        linkErrors: filteredLinkErrors,
      };
    })

    .filter(brokenPage => brokenPage.linkErrors.length > 0);

  return filteredBrokenPages;
}

module.exports = applyIgnoredRoutes;
module.exports.getReactLandingPages = _getReactLandingPages;
