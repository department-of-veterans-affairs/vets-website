const fs = require('fs');
const path = require('path');

const codeCoverageReport = fs.readFileSync(
  path.join(__dirname, '../../test-results/coverage_report.txt'),
  'utf8',
);

// eliminate unnecessary lines & spaces from coverage report
const regex = /([^A-Za-z0-9/()%-])+\s/g;

const codeCoverageData = codeCoverageReport.replace(regex, ',').split(',');

let codeCoverageMarkdown = '<table> \n <thead> \n <tr> \n'; // html format

codeCoverageData.forEach((data, index) => {
  if (data === '') {
    // ignore empty data
    codeCoverageMarkdown += '';
  } else if (index < 5) {
    // create table header
    codeCoverageMarkdown += `<th> ${data} </th> \n`;
  } else if (index === 5) {
    // seperate table header from data
    codeCoverageMarkdown += `<th> ${data} </th> \n </tr> \n </thead> \n <tbody> \n`;
  } else if ((index - 1) % 5 === 0) {
    // start of row in table body
    codeCoverageMarkdown += `<tr> \n <td> ${data} </td> \n`;
  } else if ((index - 1) % 5 === 4) {
    // end of row in table body
    codeCoverageMarkdown += `<td> ${data} </td> \n </tr> \n`;
  } else {
    // row in table body
    codeCoverageMarkdown += `<td> ${data} </td> \n`;
  }
});

codeCoverageMarkdown += `</tbody> \n </table>`; // close htmk

console.log(codeCoverageMarkdown); // eslint-disable-line no-console
