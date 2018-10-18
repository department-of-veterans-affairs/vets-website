/* eslint-disable no-param-reassign */
const cheerio = require('cheerio');

// function addError(errors, text, href, file) {
//   const key = `${text}|${href}`;
//   if (errors.has(key)) {
//     errors.get(key).files.push(file);
//   } else {
//     errors.set(key, {
//       text,
//       href,
//       files: [file],
//     });
//   }
// }

function checkExternalLinks() {
  return (files, metalsmith, done) => {
    // const relErrors = new Map();
    // const targetErrors = new Map();
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      let linkUpdated = false;

      const doc = cheerio.load(file.contents);
      doc('a[href^="http"]')
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
            // addError(targetErrors, link.text(), link.attr('href'), fileName);
          }

          if (!relAttr || !relAttr.includes('noopener')) {
            linkUpdated = true;
            link.attr('rel', `noopener ${relAttr || ''}`);
            // addError(relErrors, link.text(), link.attr('href'), fileName);
          }
        });

      if (linkUpdated) {
        file.contents = doc.html();
      }
    }

    // if (targetErrors.size > 0 || relErrors.size > 0) {
    //   console.error(
    //     Array.from(targetErrors.values())
    //       .map(
    //         e => `
    //     The link "${e.text}"
    //     (${e.href})
    //     is missing a target="_blank" attribute in ${e.files.length} file(s):
    //     ${e.files.join('\n')}
    //   `,
    //       )
    //       .join('\n'),
    //   );
    //
    //   console.error(
    //     Array.from(relErrors.values())
    //       .map(
    //         e => `
    //     The link "${e.text}"
    //     (${e.href})
    //     is missing a rel="noopener" attribute in ${e.files.length} file(s):
    //     ${e.files.join('\n')}
    //   `,
    //       )
    //       .join('\n'),
    //   );
    //   throw new Error(
    //     `There are ${relErrors.size +
    //       targetErrors.size} unique external links that do not open in a new tab or are missing noopener`,
    //   );
    // }

    done();
  };
}

module.exports = checkExternalLinks;
