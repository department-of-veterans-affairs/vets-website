module.exports = {
  reporterEnabled: 'mochawesome',
  mochawesomeReporterOptions: {
    reportDir: 'cypress/results',
    reportFilename: `${process.env.STEP}_${new Date()
      .toISOString()
      .replace(/[.:]/g, '')}`,
    overwrite: false,
    html: false,
    json: true,
  },
};
