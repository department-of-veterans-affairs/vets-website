module.exports = {
  reporterEnabled: 'mocha-junit-reporter, mochawesome',
  mochaJunitReporterReporterOptions: {
    mochaFile: 'mocha/results/junit-[hash].xml',
  },
  mochawesomeReporterOptions: {
    consoleReporter: 'min',
    reportDir: 'mocha/results',
    reportFilename: `${process.env.STEP}_${new Date()
      .toISOString()
      .replace(/[.:]/g, '')}`,
    overwrite: false,
    html: false,
    json: true,
    inlineAssets: true,
  },
};
