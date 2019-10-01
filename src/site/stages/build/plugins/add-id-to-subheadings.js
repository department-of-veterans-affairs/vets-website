/*
 * Add unique ID to H2s and H3s that aren't in WYSIWYG or accordion buttons
 */

const usedHeaders = [];

let currentId = 1;

function createUniqueId(headingEl, usedHeaders, currentHeaderId) {
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

    anchor = `${anchor}-${++currentHeaderId}`;

    if (usedHeaders.includes(anchor)) {
      console.log(usedHeaders)
      console.log(anchor)
      throw new Error('WTF')
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
        const { dom } = file;
        const tableOfContents = dom('#table-of-contents ul');

        const
        const usedHeaders = [];
        let currentHeaderId = 0;

        dom('h2, h3').each((i, el) => {
          const heading = dom(el);
          const parent = heading.parents();
          const isInAccordionButton = parent.hasClass('usa-accordion-button');
          const isInAccordion = parent.hasClass('usa-accordion-content');

          // skip heading if it already has an id and skip heading if it's in an accordion button
          if (!heading.attr('id') && !isInAccordionButton) {
            const headingID = createUniqueId(heading, usedHeaders, currentHeaderId);
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
          file.modified = true;
        }
      }
    }

    done();
  };
}

module.exports = generateHeadingIds;
