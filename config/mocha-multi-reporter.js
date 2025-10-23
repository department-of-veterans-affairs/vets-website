module.exports = {
  reporterEnabled: 'mocha-junit-reporter, mochawesome',
  mochawesomeReporterOptions: {
    consoleReporter: 'min',
    reportDir: 'mocha/results',
    reportFilename: 'unit-tests',
    overwrite: true,
    html: false,
    json: true,
  },
};
