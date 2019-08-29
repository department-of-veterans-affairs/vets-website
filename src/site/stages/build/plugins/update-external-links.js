/* eslint-disable no-param-reassign */
const cheerio = require('cheerio');

const newTabDomains = [
  'myhealth.va.gov',
  'ebenefits.va.gov',
  'www.accesstocare.va.gov',
  'www.gibill.va.gov/wave',
  'www.blogs.va.gov',
  'www.data.va.gov',
  'mobile.va.gov',
  'www.accesstocare.va.gov',
  'www.oit.va.gov',
];

function isVADomainThatOpensInNewTab(href) {
  return newTabDomains.some(domain => href.toLowerCase().includes(domain));
}

function isNonVADomainThatOpensInSameTab(href) {
  return href.toLowerCase().includes('veteranscrisisline.net');
}

function updateExternalLinks() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      let linkUpdated = false;

      if (fileName.endsWith('html')) {
        const doc = cheerio.load(file.contents);
        doc('a[href^="http"]').each((i, el) => {
          const link = doc(el);
          const relAttr = link.attr('rel');
          const targetAttr = link.attr('target');
          const hrefAttr = link.attr('href') || '';

          // We want to make sure links that open in a new tab
          // always have noopener, but data-allow-opener is an
          // escape hatch if we need it
          if (
            targetAttr === '_blank' &&
            typeof link.attr('data-allow-opener') === 'undefined' &&
            (!relAttr || !relAttr.includes('noopener'))
          ) {
            linkUpdated = true;
            link.attr('rel', `noopener ${relAttr || ''}`);
          }

          // If a link makes it through this logic, it's an
          // external link that should always open in a new tab
          // There is an escape hatch here, too
          if (
            typeof link.attr('data-same-tab') === 'undefined' &&
            !isNonVADomainThatOpensInSameTab(hrefAttr) &&
            ((!hrefAttr.includes('va.gov') && !hrefAttr.includes('vets.gov')) ||
              isVADomainThatOpensInNewTab(hrefAttr))
          ) {
            if (!targetAttr && targetAttr !== '_blank') {
              linkUpdated = true;
              link.attr('target', '_blank');

              if (!relAttr || !relAttr.includes('noopener')) {
                link.attr('rel', `noopener ${relAttr || ''}`);
              }
            }
          }
        });

        if (linkUpdated) {
          file.contents = new Buffer(doc.html());
        }
      }
    }

    done();
  };
}

module.exports = updateExternalLinks;
