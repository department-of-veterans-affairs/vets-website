const checkBrokenLinks = require('../plugins/check-broken-links');
const { expect } = require('chai');
const sinon = require('sinon');

const {
  isBrokenLink,
  applyIgnoredRoutes,
  getBrokenLinks,
  getErrorOutput,
} = checkBrokenLinks;

describe('metalsmith/check-broken-links:', () => {
  describe('isBrokenLink', () => {
    const page = '/health-care/';
    const files = new Set([
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
      'example@example.com',
    ];

    for (const badLink of badLinks) {
      it(`returns true for invalid link value - ${badLink}`, () => {
        const result = isBrokenLink(badLink, page, files);
        expect(result).to.be.true;
      });
    }

    const goodLinks = [
      '/',
      '/health-care',
      '/disability',
      '/good-asset.pdf',
      '/downloads/good%20asset.pdf',
      'mailto:example@example.com',
      'https://www.example.com',
    ];

    for (const goodLink of goodLinks) {
      it(`returns false for valid link value - ${goodLink}`, () => {
        const result = isBrokenLink(goodLink, page, files);
        expect(result).to.be.false;
      });
    }
  });

  describe('getBrokenLinks', () => {
    it('finds broken links',  () => {
      const file = {
        path: '/health-care',
        contents: `
          <div>
            <a href="/broken">Testing</a>
            <a href="/ok">Testing</a>
          </div>
        `
      };

      sinon.stub(checkBrokenLinks, 'isBrokenLink').returns(true);

      const linkErrors = getBrokenLinks(file, null);

      expect(linkErrors).to.have.lengthOf(2);
      expect(linkErrors[0]).to.have.keys(['html', 'target']);

      checkBrokenLinks.isBrokenLink.restore();


    });
  });

  describe('applyIgnoredRoutes', () => {});

  describe('getErrorOutput', () => {});

  describe('checkBrokenLinks', () => {});
});
