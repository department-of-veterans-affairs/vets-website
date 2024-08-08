const fs = require('fs');
const path = require('path');

const codeCoverageReport = fs.readFileSync(
  path.join(
    __dirname,
    '../../qa-standards-dashboard-data/coverage/coverage_report.txtt',
  ),
  'utf8',
);

// eliminate unnecessary lines & spaces from coverage report
const regex = /([^A-Za-z0-9/()%-])+\s/g;

const codeCoverageData = codeCoverageReport.replace(regex, ',').split(',');

let codeCoverageHTML = '<table> \n <thead> \n <tr> \n'; // html format

codeCoverageData.forEach((data, index) => {
  if (data === '') {
    // ignore empty data
    codeCoverageHTML += '';
  } else if (index < 5) {
    // create table header
    codeCoverageHTML += `<th> ${data} </th> \n`;
  } else if (index === 5) {
    // seperate table header from data
    codeCoverageHTML += `<th> ${data} </th> \n </tr> \n </thead> \n <tbody> \n`;
  } else if ((index - 1) % 5 === 0) {
    // start of row in table body
    codeCoverageHTML += `<tr> \n <td> ${data} </td> \n`;
  } else if ((index - 1) % 5 === 4) {
    // end of row in table body
    codeCoverageHTML += `<td> ${data} </td> \n </tr> \n`;
  } else {
    // row in table body
    codeCoverageHTML += `<td> ${data} </td> \n`;
  }
});

codeCoverageHTML += `</tbody> \n </table>`; // close html

console.log(codeCoverageHTML); // eslint-disable-line no-console
