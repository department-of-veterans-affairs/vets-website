/* eslint-disable no-console */
const fs = require('fs');

const merged = {
  total: {
    lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
    statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
    functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
    branches: { total: 0, covered: 0, skipped: 0, pct: 0 },
  },
  // You may need to initialize more structure here based on the actual content of your files
};
console.log(process.argv);
process.argv.slice(2).forEach(file => {
  try {
    const content = fs.readFileSync(file);
    const json = JSON.parse(content);
    // Assuming the structure of your files, update the cumulative values here
    ['lines', 'statements', 'functions', 'branches'].forEach(key => {
      merged.total[key].total += json.total[key].total;
      merged.total[key].covered += json.total[key].covered;
      merged.total[key].skipped += json.total[key].skipped;
      // Update percentage or handle as required
      merged.total[key].pct =
        (merged.total[key].covered / merged.total[key].total) * 100;
    });
    // Merge other parts of the JSON structure as needed
  } catch (err) {
    console.error(`Error processing file ${file}: ${err}`);
  }
});

// Write the merged results to a new file
fs.writeFileSync(
  'merged-coverage-report.json',
  JSON.stringify(merged, null, 2),
);
