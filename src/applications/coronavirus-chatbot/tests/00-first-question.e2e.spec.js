const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');

const vaAvatarMatcher = 'div#webchat div.webchat__imageAvatar__image';
const webchatBubbleContent = 'div.webchat__bubble__content';
const covid19PreventionButton =
  "div#webchat button[aria-label='COVID-19 prevention']";
const responseBubble =
  "//div[@id='webchat']//div[@class='webchat__bubble__content']//strong[contains(text(), 'What question')]";
const coronavirusChatbotPath = '/coronavirus-chatbot/';

module.exports = E2eHelpers.createE2eTest(client => {
  client
    .openUrl(`${E2eHelpers.baseUrl}${coronavirusChatbotPath}`)
    .waitForElementVisible('body', Timeouts.verySlow)
    .assert.title('VA coronavirus chatbot | Veterans Affairs')
    .waitForElementVisible(vaAvatarMatcher, 45000)
    .assert.containsText(webchatBubbleContent, 'Before we get started')
    .click(covid19PreventionButton)
    .assert.attributeEquals(covid19PreventionButton, 'disabled', 'true')
    .useXpath()
    .waitForElementVisible(responseBubble, Timeouts.normal)
    .assert.containsText(
      responseBubble,
      'What question can we answer for you first?',
    )
    .axeCheck('.main')
    .end();
});
