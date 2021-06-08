const Timeouts = require('platform/testing/e2e/timeouts');

const vaAvatarMatcher = 'div#webchat div.webchat__initialsAvatar';
const webchatBubbleContent = 'div.webchat__bubble__content';
const covid19PreventionButton =
  "div#webchat button[aria-label='COVID-19 prevention']";
const benefitsAndClaimsButton =
  "div#webchat button[aria-label='Benefits and claims']";
const wearMaskButton = "div#webchat button[aria-label='Should I wear a mask?']";
const responseBubble =
  "//div[@id='webchat']//div[@class='webchat__bubble__content']//strong[contains(text(), 'What question')]";
const coronavirusChatbotPath = '/coronavirus-chatbot/';
const chatbotResponse = require('./config/data/chatbotResponse.json');

describe('Chatbot buttons', () => {
  it.skip('Behaves as expected', () => {
    // Skipped as it is disabled currently in nightwatch
    cy.intercept('/v0/feature_toggles', {
      data: chatbotResponse,
    }).as('getChatbot');

    cy.visit(coronavirusChatbotPath);

    cy.wait('@getChatbot');

    cy.get('body', { timeout: Timeouts.verySlow }).should('be.visible');
    cy.title().should('eq', 'VA coronavirus chatbot | Veterans Affairs');
    cy.get(vaAvatarMatcher, { timeout: Timeouts.slow }).should('be.visible');
    cy.get(webchatBubbleContent).should('contain', 'Before we get started');
    cy.get(covid19PreventionButton)
      .click()
      .should('be.disabled');
    cy.get(benefitsAndClaimsButton).should('be.disabled');
    // xpath?  Searching shows that Cypress doesn't need it - hard to say without testing
    cy.get(responseBubble, { timeout: Timeouts.normal })
      .should('be.visible')
      .then(bubble => {
        cy.wrap(bubble).should(
          'contain',
          'What question can we answer for you first?',
        );
      });
    // If xpath is an issue, switch back to css here
    cy.get(wearMaskButton)
      .should('not.be.disabled')
      .then(button => {
        cy.wrap(button)
          .click()
          .should('be.disabled');
      });
    cy.injectAxeThenAxeCheck();

    // Note: This test requires the real API. Run locally with yarn watch --env.api=https://dev-api.va.gov
  });
});
