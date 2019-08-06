const cheerio = require('cheerio');

const _isBrokenLink = require('./isBrokenLink');

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
