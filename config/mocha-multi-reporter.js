const matrix = process.env.STEP || '0';

module.exports = {
  reporterEnabled: 'mocha-junit-reporter, mochawesome',
  mochawesomeReporterOptions: {
    consoleReporter: 'min',
    reportDir: 'mocha/results',
    reportFilename: `unit-tests-${matrix}`,
    overwrite: true,
    html: false,
    json: true,
  },
};
