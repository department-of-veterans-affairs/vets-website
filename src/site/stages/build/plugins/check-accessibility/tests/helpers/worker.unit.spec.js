const { expect } = require('chai');

const worker = require('../../helpers/worker');

const { executeAxeCheck } = worker;

const AXE_RESULT_SHAPE = [
  // From https://github.com/dequelabs/axe-core/blob/16682fdb4aefa1bb0b181235fb4b9f23bd51c99c/doc/API.md#results-object
  'url',
  'timestamp',
  'passes',
  'violations',
  'inapplicable',
  'incomplete',
];

describe('worker', () => {
  it('returns results with no violations when passed HTML has no violations', async () => {
    const okayHtml = `
      <html lang="en">
      <head>
        <title>Okay HTML</title>
      </head>
      <body>
        <h1>Okay HTML</h1>
      </body>
      </html>
    `;

    const result = await executeAxeCheck({
      url: new URL('https://www.va.gov/okay-html'),
      contents: okayHtml,
    });

    expect(result).to.have.keys(AXE_RESULT_SHAPE);
    expect(result.violations).to.have.lengthOf(0);
  });

  it('returns results with violations when passed HTML has violations', async () => {
    const badHtml = `
      <html lang="en">
        <head>
          <title>Bad HTML</title>
        </head>
        <body>
          <h1>Bad HTML</h1>
          <ul>
            <p>Bad invalid</p>
          </ul>
        </body>
      </html>
    `;

    const result = await executeAxeCheck({
      url: new URL('https://www.va.gov/okay-html'),
      contents: badHtml,
    });

    expect(result.violations).to.have.length.greaterThan(0);
  });
});
