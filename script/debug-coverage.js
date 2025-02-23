// const fs = require('fs');

// const data = JSON.parse(
//   fs.readFileSync('merged-coverage-report.json', 'utf-8'),
// );

// const filteredData = Object.keys(data).filter(key => key.includes('22-5490'));
// let total = 0;
// filteredData.forEach(item => {
//   console.log(item);
//   console.log(data[item]);
//   total += data[item].lines.covered;
//   console.log(`adding ${data[item].lines.covered} to total`);
//   console.log(`running total: ${total}`);
// });
