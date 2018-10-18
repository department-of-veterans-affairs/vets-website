/* eslint-disable no-param-reassign */
const cheerio = require('cheerio');

function checkExternalLinks() {
  return (files, metalsmith, done) => {
    // const relErrors = new Map();
    // const targetErrors = new Map();
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      let linkUpdated = false;

      const doc = cheerio.load(file.contents);
      doc('a[href^="http"]')
        .each((i, el) => {
          const link = doc(el);
          const relAttr = link.attr('rel');
          const targetAttr = link.attr('target');

          if (
            targetAttr === '_blank' &&
            (!relAttr || !relAttr.includes('noopener'))
          ) {
            linkUpdated = true;
            link.attr('rel', `noopener ${relAttr || ''}`);
          }
        })
        .not('[href*="va.gov"]')
        .not('[href*="vets.gov"]')
        .not('.no-external-icon')
        .not('[data-no-external]')
        .each((i, el) => {
          const link = doc(el);
          const relAttr = link.attr('rel');
          const targetAttr = link.attr('target');

          if (targetAttr !== '_blank') {
            linkUpdated = true;
            link.attr('target', '_blank');
          }

          if (!relAttr || !relAttr.includes('noopener')) {
            linkUpdated = true;
            link.attr('rel', `noopener ${relAttr || ''}`);
          }
        });

      if (linkUpdated) {
        file.contents = new Buffer(doc.html());
      }
    }

    done();
  };
}

module.exports = checkExternalLinks;
