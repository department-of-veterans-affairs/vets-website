const fs = require('fs');
/* eslint-disable no-console */
async function mergeCoverageReports(files) {
  const merged = {
    total: {
      lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
      functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
      statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
      branches: { total: 0, covered: 0, skipped: 0, pct: 0 },
    },
  };

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      ['lines', 'functions', 'statements', 'branches'].forEach(key => {
        merged.total[key].total += data.total[key].total;
        merged.total[key].covered += data.total[key].covered;
        merged.total[key].skipped += data.total[key].skipped;
        merged.total[key].pct =
          (merged.total[key].covered / merged.total[key].total) * 100;
      });

      Object.keys(data).forEach(appKey => {
        if (appKey !== 'total') {
          merged[appKey] = data[appKey];
        }
      });
    } catch (err) {
      console.error(`Error reading ${file}: ${err}`);
    }
  }

  ['lines', 'functions', 'statements', 'branches'].forEach(key => {
    merged.total[key].pct = (
      (merged.total[key].covered / merged.total[key].total) *
      100
    ).toFixed(2);
  });

  return merged;
}

const files = process.argv.slice(2);
mergeCoverageReports(files).then(merged => {
  console.log(JSON.stringify(merged, null, 2));

  fs.writeFileSync(
    'merged-coverage-report.json',
    JSON.stringify(merged, null, 2),
    'utf8',
  );
});
