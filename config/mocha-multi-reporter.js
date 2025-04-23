module.exports = {
  reporterEnabled: 'mocha-junit-reporter, mochawesome',
  mochaJunitReporterReporterOptions: {
    mochaFile: 'mocha/results/junit-[hash].xml',
    skipEmptyTestSuite: true,
  },
  mochawesomeReporterOptions: {
    reportDir: 'mocha/results',
    inlineAssets: true,
  },
};
