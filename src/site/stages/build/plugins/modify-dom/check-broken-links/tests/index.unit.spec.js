const brokenLinkChecker = require('../index');
const { expect } = require('chai');

describe('broken link checker', () => {
  it('determines if homepage is broken', () => {
    let brokenPages = [{ path: '/', linkErrors: new Array(1) }];

    expect(brokenLinkChecker.deriveIsHomepageBroken(brokenPages)).to.be.true;

    brokenPages = [{ path: '/not-homepage', linkErrors: new Array(1) }];

    expect(brokenLinkChecker.deriveIsHomepageBroken(brokenPages)).to.be.false;
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
