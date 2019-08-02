function applyIgnoredRoutes(brokenPages, files) {
  // We ignore React landing pages, because React apps have
  // dynamic, client-side routing and only the root page
  // will have an HTML page.

  // We also ignore pages ending in .asp, because although those
  // pages are under the same domain, they are not part of our
  // source code, so we can't validate them.

  const reactLandingPages = Object.keys(files)
    .map(fileName => files[fileName])
    .filter(file => !!file.entryname)
    .map(file => file.path);

  const filteredBrokenPages = brokenPages.filter(brokenPage => {
    const filteredBrokenPage = { ...brokenPage };

    filteredBrokenPage.linkErrors = brokenPage.linkErrors
      .filter(linkError => !linkError.target.endsWith('.asp'))
      .filter(linkError =>
        reactLandingPages.some(reactPath =>
          linkError.target.startsWith(reactPath),
        ),
      );

    return filteredBrokenPage.linkErrors.length > 0;
  });

  return filteredBrokenPages;
}

module.exports = applyIgnoredRoutes;
