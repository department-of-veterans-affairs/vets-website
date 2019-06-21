/*
 * Add unique ID to H2s and H3s that aren't in WYSIWYG or accordion buttons
 */

const cheerio = require('cheerio');

const usedHeaders = [];

function createUniqueId(headingEl) {
  const headingString = headingEl.text();
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

function generateHeadingIds() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      let idAdded = false;

      if (fileName.endsWith('html')) {
        const doc = cheerio.load(file.contents);
        doc('h2, h3').each((i, el) => {
          const heading = doc(el);
          const parent = heading.parent();
          const isInWysiwyg = parent.hasClass('processed-content');
          const isInAccordionButton = parent.hasClass('usa-accordion-button');

          // skip heading if it already has an id and skip heading if it's in wysiwyg content
          if (!heading.attr('id') && !isInWysiwyg && !isInAccordionButton) {
            const headingID = createUniqueId(heading);
            heading.attr('id', headingID);
            idAdded = true;
          }
        });

        if (idAdded) {
          file.contents = new Buffer(doc.html());
        }
      }
    }

    done();
  };
}

module.exports = generateHeadingIds;
