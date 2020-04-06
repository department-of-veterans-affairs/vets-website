const getErrorOutput = require('../../helpers/getErrorOutput');

describe('getErrorOutput', () => {
  test('includes the total number of broken links', () => {
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

    expect(result).toEqual(expect.arrayContaining(['45']));
  });
});
