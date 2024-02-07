import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import mockSpecialCharsMessage from './fixtures/message-response-specialchars.json';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT } from './utils/constants';
import mockRecipients from './fixtures/recipients-response.json';
import mockBlockedRecipientsresponse from './fixtures/recipientsResponse/blocked-recipients-response.json';

describe('recipients dropdown box', () => {
  it('preferredTriageTeam select dropdown default ', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();

    cy.get('[data-testid="compose-message-link"]').click();
    PatientInterstitialPage.getContinueButton().click();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.get('[data-testid="compose-recipient-select"]').should('exist');
    cy.get('[data-testid="compose-recipient-select"]')
      .find('select')
      .find('option')
      .its('length')
      .should('equal', mockRecipients.data.length + 1);
    cy.get('[data-testid="compose-message-categories"]')
      .first()
      .click();
  });

  it('preferredTriageTeam select dropdown false', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      mockSpecialCharsMessage,
      mockBlockedRecipientsresponse,
    );

    cy.injectAxe();

    // ad assertion to check blocked group does not exist in the dd list

    cy.get('[data-testid="compose-message-link"]').click();
    PatientInterstitialPage.getContinueButton().click();
    cy.wait('@recipients').then(() => {
      cy.get('[data-testid="compose-recipient-select"]')
        .find('select')
        .find('option')
        .its('length')
        .should('equal', mockBlockedRecipientsresponse.data.length);
      cy.get('[data-testid="compose-message-categories"]')
        .first()
        .click();
    });
  });
});
