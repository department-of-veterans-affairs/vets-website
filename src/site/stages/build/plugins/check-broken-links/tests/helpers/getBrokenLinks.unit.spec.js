const sinon = require('sinon');
const cheerio = require('cheerio');

const getBrokenLinks = require('../../helpers/getBrokenLinks');

const anchor = '<a href="/link">Testing</a>';
const img = '<img src="/another-link.png">';
const span = '<span>Not a link</span>';
const anchorWithoutHref = '<a>Link</a>';

const getFile = tag => {
  const contents = `<div>${anchor}${tag}</div>`;
  return {
    path: '/health-care',
    contents,
    dom: cheerio.load(contents),
  };
};

describe('getBrokenLinks', () => {
  const detectAllLinksBroken = sinon.stub().returns(true);
  const detectAllLinksOkay = sinon.stub().returns(false);

  it('finds broken links', () => {
    const linkErrors = getBrokenLinks(getFile(img), [], detectAllLinksBroken);
    expect(linkErrors).toHaveLength(2);
  });

  it('does not detect non-links as a link', () => {
    const linkErrors = getBrokenLinks(getFile(span), [], detectAllLinksBroken);
    expect(linkErrors).toHaveLength(1);
    expect(linkErrors[0].html).toBe(anchor);
  });

  it('does not detect valid links as broken', () => {
    const linkErrors = getBrokenLinks(getFile(img), [], detectAllLinksOkay);
    expect(linkErrors).toHaveLength(0);
  });

  it('skips anchors without an HREF attribute', () => {
    const linkErrors = getBrokenLinks(
      getFile(anchorWithoutHref),
      [],
      detectAllLinksBroken,
    );
    expect(linkErrors).toHaveLength(1);
  });
});
