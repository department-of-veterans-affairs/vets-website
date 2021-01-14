const { expect } = require('chai');

const getErrorOutput = require('../../helpers/getErrorOutput');

describe('getErrorOutput', () => {
  it('includes the total number of broken links', () => {
    const brokenPages = [
      {
        path: 'health-care',
        linkErrors: new Array(25),
      },
      {
        path: 'health-care/how-to-apply',
        linkErrors: new Array(20),
      },
    ];

    const result = getErrorOutput(brokenPages);

    expect(result).to.contain('45');
  });
});
