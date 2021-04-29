const brokenLinkChecker = require('../index');
const { expect } = require('chai');

describe('broken link checker', () => {
  describe('deriveIsHomepageBroken', () => {
    it('returns true when homepage is broken', () => {
      const brokenPages = [{ path: '/', linkErrors: new Array(1) }];
      expect(brokenLinkChecker.deriveIsHomepageBroken(brokenPages)).to.be.true;
    });
    it('returns false when homepage is not broken', () => {
      const brokenPages = [{ path: '/not-homepage', linkErrors: new Array(1) }];
      expect(brokenLinkChecker.deriveIsHomepageBroken(brokenPages)).to.be.false;
    });
  });

  it('counts total broken links', () => {
    const brokenPages = [
      { path: '/', linkErrors: new Array(5) },
      { path: '/a', linkErrors: new Array(5) },
      { path: '/b', linkErrors: new Array(5) },
    ];

    expect(brokenLinkChecker.getCountOfBrokenLinks(brokenPages)).to.be.equal(
      15,
    );
  });
});
