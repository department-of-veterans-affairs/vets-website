module.exports = {
  reporterEnabled: 'mochawesome',
  mochawesomeReporterOptions: {
    reportDir: 'cypress/results',
    reportFilename: `${process.env.STEP}_${new Date()}`,
    overwrite: false,
    html: false,
    json: true,
  },
};
