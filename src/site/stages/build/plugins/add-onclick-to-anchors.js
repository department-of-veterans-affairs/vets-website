/*
 * Add onclick analytics tracking to a tags in wysiwygs.
 */

function generateOnClicks() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (fileName.endsWith('html')) {
        const { dom } = file;

        dom('div.service-accordion-output a').each((index, el) => {
          const aItem = dom(el);
          aItem.attr(
            'onclick',
            "recordEvent({ event: 'nav-accordion-embedded-link-click' })",
          );
          file.modified = true;
        });
      }
    }
    done();
  };
}

module.exports = generateOnClicks;
