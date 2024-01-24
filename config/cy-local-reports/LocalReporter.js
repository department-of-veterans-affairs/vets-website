/* LocalReporter.js
  * Custom reporter to create a separate report-file for each spec-file
*/
const Mochawesome = require('mochawesome');

class LocalReporter extends Mochawesome {
  constructor(runner, options) {
    super(runner, options);

    runner.on('suite', suite => {
      if (suite.file) {
        const specName = suite.file
          .split('/')
          .pop()
          .split('.')[0];
        this.options.reportFilename = specName;
      }
    });
  }

  done(failures, exit) {
    this.options.reportDir = 'mochawesome-report';

    // Call the parent done method
    super.done(failures, exit);
  }
}

module.exports = LocalReporter;
