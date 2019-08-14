const { expect } = require('chai');
const sinon = require('sinon');

const getBrokenLinks = require('../../helpers/getBrokenLinks');

const anchor = '<a href="/link">Testing</a>';
const img = '<img src="/another-link.png">';
const span = '<span>Not a link</span>';

describe('getBrokenLinks', () => {
  it('finds broken links', () => {
    const file = {
      path: '/health-care',
      contents: `<div>${anchor}${img}</div>`,
    };

    const detectAllLinksBroken = sinon.stub().returns(true);
    const linkErrors = getBrokenLinks(file, [], detectAllLinksBroken);

    expect(linkErrors).to.have.lengthOf(2);
  });

  it('does not detect non-links as a link', () => {
    const file = {
      path: '/health-care',
      contents: `<div>${anchor}${span}</div>`,
    };

    const detectAllLinksBroken = sinon.stub().returns(true);
    const linkErrors = getBrokenLinks(file, [], detectAllLinksBroken);

    expect(linkErrors).to.have.lengthOf(1);
    expect(linkErrors[0].html).to.be.equal(anchor);
  });

  it('does not detect valid links as broken', () => {
    const file = {
      path: '/health-care',
      contents: `<div>${anchor}${img}</div>`,
    };

    const detectAllLinksOkay = sinon.stub().returns(false);
    const linkErrors = getBrokenLinks(file, [], detectAllLinksOkay);

    expect(linkErrors).to.have.lengthOf(0);
  });
});
