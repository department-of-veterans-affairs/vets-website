/* eslint-disable no-param-reassign, no-console, no-continue */

const cheerio = require('cheerio');
const path = require('path');
const url = require('url');

const ENVIRONMENTS = require('../../../../constants/environments');

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

function getBrokenLinks(file, allPaths) {
  const $ = cheerio.load(file.contents);
  const elements = $('a, img');
  const currentPath = file.path;

  const linkErrors = [];

  elements.each((index, node) => {
    const $node = $(node);

    let target = null;

    if ($node.is('a')) {
      const namedAnchor = !!$node.prop('name');

      target = $node.attr('href');

      if (!target && namedAnchor) {
        return;
      }
    }

    if ($node.is('img')) {
      target = $node.attr('src') || $node.attr('data-src');
    }

    const isBroken = isBrokenLink(target, currentPath, allPaths);

    if (isBroken) {
      const html = cheerio.html($node);
      linkErrors.push({
        html,
        target,
      });
    }
  });

  return linkErrors;
}

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

  brokenPages = brokenPages.filter(brokenPage => {
    brokenPage.linkErrors = brokenPage.linkErrors
      .filter(linkError => !linkError.target.endsWith('.asp'))
      .filter(linkError =>
        reactLandingPages.some(reactPath =>
          linkError.target.startsWith(reactPath),
        ),
      );

    return brokenPage.linkErrors.length > 0;
  });

  return brokenPages;
}

function getErrorOutput(brokenPages) {
  const brokenLinkCount = brokenPages.reduce(
    (sum, page) => sum + page.linkErrors.length,
    0,
  );
  const separator = '\n\n---\n\n';
  const header = `${separator}There are ${brokenLinkCount} broken links!${separator}`;

  const body = brokenPages
    .map(brokenPage => {
      let pageChunk = `There are ${
        brokenPage.linkErrors.length
      } broken links on ${brokenPage.path}:\n\n`;
      pageChunk += brokenPage.linkErrors.map(link => link.html).join('\n');
      return pageChunk;
    })
    .join(separator);

  return header + body + separator;
}

function checkBrokenLinks(buildOptions) {
  return (files, metalsmith, done) => {
    const fileNames = Object.keys(files);
    const allPaths = new Set(fileNames);

    let brokenPages = [];

    for (const fileName of fileNames) {
      const isHtml = path.extname(fileName) === '.html';
      if (!isHtml) continue;

      const file = files[fileName];
      const linkErrors = getBrokenLinks(file, allPaths);

      if (linkErrors.length > 0) {
        brokenPages.push({
          path: file.path,
          linkErrors,
        });
      }
    }

    brokenPages = applyIgnoredRoutes(brokenPages, files);

    if (brokenPages.length > 0) {
      const errorOutput = getErrorOutput(brokenPages);

      if (buildOptions.buildtype === ENVIRONMENTS.VAGOVPROD) {
        done(errorOutput);
        return;
      }
      console.log(errorOutput);
    }

    done();
  };
}

module.exports = checkBrokenLinks;

module.exports.getErrorOutput = getErrorOutput;
module.exports.applyIgnoredRoutes = applyIgnoredRoutes;
module.exports.getBrokenLinks = getBrokenLinks;
module.exports.isBrokenLink = isBrokenLink;
