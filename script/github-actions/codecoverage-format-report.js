const fs = require('fs');
const path = require('path');

const codecoverageReport = fs.readFileSync(
  path.join(__dirname, '../../test-results/coverage_report.txt'),
  'utf8',
);

// eliminiate unnecessary lines & spaces from coverage report
const regex = /([^A-Za-z0-9\/()%-])+\s/g; // eslint-disable-line no-useless-escape

const codecoverageData = codecoverageReport.replace(regex, ',').split(',');

let codecoverageMarkdown = '';

codecoverageData.forEach((data, index) => {
  if (data === '') {
    // ignore empty data
    codecoverageMarkdown += '';
  } else if (index < 5) {
    // create table header
    if ((index - 1) % 4 === 0) {
      codecoverageMarkdown += `| ${data} | `;
    } else if ((index - 1) % 4 === 3) {
      codecoverageMarkdown += `${data} | \n`;
    } else {
      codecoverageMarkdown += `${data} | `;
    }
  } else if (index === 5) {
    // seperate table header from data
    codecoverageMarkdown += `| - | - | - | - | \n`;
  } else if ((index - 1) % 5 === 0) {
    codecoverageMarkdown += `| ${data} | `;
  } else if ((index - 1) % 5 === 4) {
    codecoverageMarkdown += `${data} | \n`;
  } else {
    codecoverageMarkdown += `${data} | `;
  }
});

// fs.writeFileSync(
//   path.join(__dirname, '../../test-results/formatted_coverage_report.md'),
//   codecoverageMarkdown,
// );

console.log(codecoverageMarkdown); // eslint-disable-line no-console
