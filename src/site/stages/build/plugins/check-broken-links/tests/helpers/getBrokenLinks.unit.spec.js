const { expect } = require('chai');
const sinon = require('sinon');

const getBrokenLinks = require('../../helpers/getBrokenLinks');

describe('getBrokenLinks', () => {
  it('finds broken links', () => {
    const file = {
      path: '/health-care',
      contents: `
        <div>
          <a href="/broken">Testing</a>
          <a href="/ok">Testing</a>
        </div>
      `,
    };

    sinon.stub(checkBrokenLinks, 'isBrokenLink').returns(true);

    const linkErrors = getBrokenLinks(file, null);

    expect(linkErrors).to.have.lengthOf(2);
    expect(linkErrors[0]).to.have.keys(['html', 'target']);

    checkBrokenLinks.isBrokenLink.restore();
  });
});
