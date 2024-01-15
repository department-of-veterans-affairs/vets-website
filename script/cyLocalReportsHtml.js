/* cyLocalReportsHtml.js
  * Supports run-local-cy-with-reports.js Node-script:
  * Generates an index.html file with a link for each generated
  * HTML report-file found in /mochawesome-report folder.
 */
const fs = require('fs');
const cheerio = require('cheerio');

function getTestCounts(suites) {
  /* eslint-disable no-param-reassign */
  return suites.reduce(
    (counts, suite) => {
      // Add counts from tests in the suite
      suite.tests.forEach(test => {
        if (test.pass) counts.passes += 1;
        if (test.fail) counts.failures += 1;
        if (test.pending) counts.pending += 1;
        if (test.skipped) counts.skipped += 1;
      });

      // Recursively add counts from nested suites
      if (suite.suites) {
        const nestedCounts = getTestCounts(suite.suites);
        counts.passes += nestedCounts.passes;
        counts.failures += nestedCounts.failures;
        counts.pending += nestedCounts.pending;
        counts.skipped += nestedCounts.skipped;
      }

      return counts;
    },
    {
      passes: 0,
      failures: 0,
      pending: 0,
      skipped: 0,
    },
  );
  /* eslint-enable no-param-reassign */
}

function getReportFileLinkItem(file) {
  const content = fs.readFileSync(`mochawesome-report/${file}`, 'utf8');
  const $ = cheerio.load(content);
  const dataRaw = $('body').attr('data-raw');
  const data = JSON.parse(decodeURIComponent(encodeURIComponent(dataRaw)));
  const { passes, failures, pending, skipped } = getTestCounts(
    data.results[0].suites,
  );

  return `<li>
    <strong><a href="${file}" class="fs-5">
      ${file
        .replace(/_/g, ' ')
        .replace('.html', '')
        .trim()}
    </a></strong>&nbsp;&mdash;&nbsp;
    <span>
      <span class=${passes ? 'text-success' : 'text-warning'}>
        Passed: ${passes};
      </span>&nbsp;
      <span class=${failures ? 'text-danger' : 'text-success'}>
        Failed: ${failures};
      </span>&nbsp;
      <span class=${skipped ? 'text-warning' : ''}>
        Skipped: ${skipped};
      </span>&nbsp;
      Pending: ${pending}
    </span>
  </li>`;
}

module.exports = function cyLocalReportsHtml(htmlFiles2) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cypress test-results</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <div class="row">
          <div class="col">
            <h1>Cypress test-results</h1>
            <p><strong>Spec-files run</strong>:</p>
            <ul>
              ${htmlFiles2.map(file => getReportFileLinkItem(file)).join('\n')}
            </ul>
          </div>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    </body>
    </html>
  `;
};
