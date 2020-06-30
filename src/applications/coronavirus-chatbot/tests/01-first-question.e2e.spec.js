const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');

const vaAvatarMatcher = 'div#webchat div.webchat__imageAvatar__image';
const webchatBubbleContent = 'div.webchat__bubble__content';
const covid19PreventionButton =
  "div#webchat button[aria-label='COVID-19 prevention']";
const benefitsAndClaimsButton =
  "div#webchat button[aria-label='Benefits and claims']";
const wearMaskButton = "div#webchat button[aria-label='Should I wear a mask?']";
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
    .assert.isDisabledElement(covid19PreventionButton, true)
    .assert.isDisabledElement(benefitsAndClaimsButton, true)
    .useXpath()
    .waitForElementVisible(responseBubble, Timeouts.normal)
    .assert.containsText(
      responseBubble,
      'What question can we answer for you first?',
    )
    .useCss()
    .assert.isDisabledElement(wearMaskButton, false)
    .click(wearMaskButton)
    .assert.isDisabledElement(wearMaskButton, true)
    .axeCheck('.main')
    .end();
});

// Note: This test requires the real API. Run locally with yarn watch --env.api=https://dev-api.va.gov
module.exports['@disabled'] = true;
