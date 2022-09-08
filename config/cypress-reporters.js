module.exports = {
  reporterEnabled: 'mochawesome',
  mochawesomeReporterOptions: {
    reportDir: 'cypress/results',
    reportFileName: `${process.env.STEP}_${new Date()}`,
    overwrite: false,
    html: false,
    json: true,
  },
};
