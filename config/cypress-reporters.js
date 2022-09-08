import { v4 as uuidv4 } from 'uuid';

module.exports = {
  reporterEnabled: 'mochawesome',
  mochawesomeReporterOptions: {
    reportDir: 'cypress/results',
    reportFileName: uuidv4(),
    overwrite: false,
    html: false,
    json: true,
  },
};
