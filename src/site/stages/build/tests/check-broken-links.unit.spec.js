const checkBrokenLinks = require('../plugins/check-broken-links');
const { expect } = require('chai');

const { isBrokenLink } = checkBrokenLinks;

describe('metalsmith/check-broken-links:', () => {
  describe('isBrokenLink', () => {
    const page = '/health-care/';
    const allPaths = new Set([
      'index.html',
      'health-care/index.html',
      'disability/index.html',
      'good-asset.pdf',
      'downloads/good asset.pdf',
    ]);

    const badLinks = [
      null,
      undefined,
      '',
      'health-care',
      '/bad-link',
      '/bad-asset.pdf',
      '/bad asset.pdf',
    ];

    for (const badLink of badLinks) {
      it(`returns true for invalid link value - ${badLink}`, () => {
        const result = isBrokenLink(badLink, page, allPaths);
        expect(result).to.be.true;
      });
    }

    const goodLinks = [
      '/',
      '/health-care',
      '/disability',
      '/good-asset.pdf',
      '/downloads/good%20asset.pdf',
    ];

    for (const goodLink of goodLinks) {
      it(`returns false for valid link value - ${goodLink}`, () => {
        const result = isBrokenLink(goodLink, page, allPaths);
        expect(result).to.be.false;
      });
    }
  });
});
