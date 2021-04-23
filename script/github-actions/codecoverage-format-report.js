const fs = require('fs');
const path = require('path');

const codecoverageReport = fs.readFileSync(
  path.join(__dirname, '../../test-results/coverage_report.txt'),
  'utf8',
);

// eliminate unnecessary lines & spaces from coverage report
const regex = /([^A-Za-z0-9\/()%-])+\s/g; // eslint-disable-line no-useless-escape

const codecoverageData = codecoverageReport.replace(regex, ',').split(',');

let codecoverageMarkdown = '<table> \n <thead> \n <tr> \n'; // markdown format

codecoverageData.forEach((data, index) => {
  if (data === '') {
    // ignore empty data
    codecoverageMarkdown += '';
  } else if (index < 5) {
    // create table header
    codecoverageMarkdown += `<th> ${data} </th> \n`;
  } else if (index === 5) {
    // seperate table header from data
    codecoverageMarkdown += `<th> ${data} </th> \n </tr> \n </thead> \n <tbody> \n`;
  } else if ((index - 1) % 5 === 0) {
    // start of row in table body
    codecoverageMarkdown += `<tr> \n <td> ${data} </td> \n`;
  } else if ((index - 1) % 5 === 4) {
    // end of row in table body
    codecoverageMarkdown += `<td> ${data} </td> \n </tr> \n`;
  } else {
    // row in table body
    codecoverageMarkdown += `<td> ${data} </td> \n`;
  }
});

codecoverageMarkdown += `</tbody> \n </table>`; // close markdown

console.log(codecoverageMarkdown); // eslint-disable-line no-console
