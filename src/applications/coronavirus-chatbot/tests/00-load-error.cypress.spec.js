const Timeouts = require('platform/testing/e2e/timeouts');

const loadError = 'div.usa-alert.usa-alert-error';
const loadErrorHeading = 'h3.usa-alert-heading';
const coronavirusChatbotPath = '/coronavirus-chatbot/';

describe('Chatbot Load Error', () => {
  it('Shows proper error message', () => {
    cy.visit(coronavirusChatbotPath);
    cy.get('body', { timeout: Timeouts.verySlow }).should('be.visible');
    cy.title().should('eq', 'VA coronavirus chatbot | Veterans Affairs');
    cy.get(loadError)
      .should('be.visible')
      .then(() => {
        cy.get(loadErrorHeading).should('contain', "We can't load the chatbot");
      });
    cy.injectAxeThenAxeCheck();
  });
});
