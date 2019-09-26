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
        const tableOfContents = doc('#table-of-contents ul');
        doc('h2, h3').each((i, el) => {
          const heading = doc(el);
          const parent = heading.parents();
          const isInAccordionButton = parent.hasClass('usa-accordion-button');
          const isInAccordion = parent.hasClass('usa-accordion-content');

          // skip heading if it already has an id and skip heading if it's in an accordion button
          if (!heading.attr('id') && !isInAccordionButton) {
            const headingID = createUniqueId(heading);
            heading.attr('id', headingID);
            idAdded = true;
          }

          // if it is an h2, add the h2 to the table of contents
          if (
            el.tagName.toLowerCase() === 'h2' &&
            tableOfContents &&
            heading.text().toLowerCase() !== 'on this page' &&
            !isInAccordionButton &&
            !isInAccordion
          ) {
            tableOfContents.append(
              `<li class="vads-u-margin-bottom--2">
                  <a href="#${heading.attr(
                    'id',
                  )}" class="vads-u-text-decoration--none">
                    <i class="fas fa-arrow-down va-c-font-size--xs vads-u-margin-right--1"></i> 
                    ${heading.text()}
                  </a>
                </li>`,
            );
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
