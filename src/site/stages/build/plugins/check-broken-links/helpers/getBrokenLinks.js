const cheerio = require('cheerio');

const _isBrokenLink = require('./isBrokenLink');

/**
 * Parses the <a> and <img> elements from an HTML file, validating each HREF/SRC value.
 * @param {*} file The HTML file from the Metalsmith pipeline
 * @param {Set<string>} allPaths The paths of all files in the website. Used to confirm the existence of a file.
 */
function getBrokenLinks(file, allPaths, isBrokenLink = _isBrokenLink) {
  const $ = cheerio.load(file.contents);
  const elements = $('a, img');
  const currentPath = file.path;

  const linkErrors = [];

  elements.each((index, node) => {
    const $node = $(node);

    let target = null;

    if ($node.is('a')) {
      target = $node.attr('href');
    } else if ($node.is('img')) {
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

module.exports = getBrokenLinks;
