const matrix = process.env.CI_NODE || '0';

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
