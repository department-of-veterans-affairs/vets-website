const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');

const loadError = 'div.usa-alert.usa-alert-error';
const loadErrorHeading = 'h3.usa-alert-heading';
const coronavirusChatbotPath = '/coronavirus-chatbot/';

module.exports = E2eHelpers.createE2eTest(client => {
  client.mockData({
    path: '/v0/feature_toggles',
    verb: 'get',
    value: {
      data: {
        features: [],
        type: 'feature_toggles',
      },
    },
  });

  client
    .openUrl(`${E2eHelpers.baseUrl}${coronavirusChatbotPath}`)
    .waitForElementVisible('body', Timeouts.verySlow)
    .assert.title('VA coronavirus chatbot | Veterans Affairs')
    .waitForElementVisible(loadError, 45000)
    .assert.containsText(loadErrorHeading, "We can't load the chatbot")
    .axeCheck('.main')
    .end();
});
