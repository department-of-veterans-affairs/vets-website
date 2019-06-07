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
  headingsArray.forEach(heading => {
    const parent = heading.parentNode;
    const isInWysiwyg = parent.classList.contains('processed-content');
    const isInAccordionButton = parent.classList.contains(
      'usa-accordion-button',
    );
    // skip heading if it already has an id and skip heading if it's in wysiwyg content
    if (!heading.id && !isInWysiwyg && !isInAccordionButton) {
      const headingID = createUniqueId();
      heading.setAttribute('id', headingID);
    }
  });
}

function generateHeadingIds() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (fileName.endsWith('html')) {
        const doc = cheerio.load(file.contents);
        const headings = Array.from(doc.querySelectorAll('h2, h3'));
        if (headings.length > 0) {
          addUniqueIds(headings);
        }
      }
    }

    done();
  };
}

module.exports = generateHeadingIds;
