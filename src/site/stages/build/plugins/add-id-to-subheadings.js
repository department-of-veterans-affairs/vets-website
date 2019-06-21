/*
 * Add unique ID to H2s and H3s that aren't in WYSIWYG or accordion buttons
 */

const cheerio = require('cheerio');

const usedHeaders = [];

let currentId = 1;

function createUniqueId(headingEl) {
  const headingString = headingEl.text();
  const length = 30;
  let anchor = headingString
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s/g, '-')
    .replace(/-+$/, '')
    .substring(0, length);

  if (usedHeaders.includes(anchor)) {
    if (!usedHeaders.includes(`${anchor}-${currentId}`)) {
      anchor = `${anchor}-${currentId}`;
      currentId++;
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
