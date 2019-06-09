/*
 * Add unique ID to H2s and H3s that aren't in WYSIWYG or accordion buttons
 */

const cheerio = require('cheerio');
// const _ = require('lodash');

const usedHeaders = [];

function createUniqueId(headingEl) {
  const headingString = headingEl.innerHTML;
  let anchor = headingString
    .trim()
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\s+/g, '-');
  if (usedHeaders.indexOf(anchor) !== -1) {
    let i = 1;
    while (usedHeaders.indexOf(`${anchor}-${i}`) !== -1 && i++ <= 10) {
      anchor = `${anchor}-${i}`;
    }
  }
  usedHeaders.push(anchor);
  return anchor;
}

function addUniqueIds(headingsArray) {
  headingsArray.each(heading => {
    const $ = cheerio.load(heading);
    const parent = $.parent();
    const isInWysiwyg = parent.hasClass('processed-content');
    const isInAccordionButton = parent.hasClass('usa-accordion-button');

    // skip heading if it already has an id and skip heading if it's in wysiwyg content
    if (!$.id && !isInWysiwyg && !isInAccordionButton) {
      const headingID = createUniqueId($);
      $.attr('id', headingID);
    }
  });
}

function generateHeadingIds() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (fileName.endsWith('html')) {
        const $ = cheerio.load(file.contents);
        const headings = $('h2, h3');
        if (headings.length > 0) {
          addUniqueIds(headings);
        }
      }
    }

    done();
  };
}

module.exports = generateHeadingIds;
