module.exports = {
  reporterEnabled: 'mochawesome',
  mochawesomeReporterOptions: {
    reportDir: 'cypress/results',
    reportFileName: `${process.env.CI_NODE_INDEX}_${new Date()}`,
    overwrite: false,
    html: false,
    json: true,
  },
};
