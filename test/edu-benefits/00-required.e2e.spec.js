if (process.env.BUILDTYPE !== 'production') {
  const E2eHelpers = require('../util/e2e-helpers');
  const Timeouts = require('../util/timeouts.js');
  const EduHelpers = require('../util/edu-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      EduHelpers.initApplicationSubmitMock();

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for education benefits: Vets.gov')
        .waitForElementVisible('div.form-progress-buttons', Timeouts.slow);
    }
  );
}
