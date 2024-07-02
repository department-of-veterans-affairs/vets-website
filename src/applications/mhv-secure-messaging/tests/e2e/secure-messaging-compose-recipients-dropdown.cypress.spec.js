import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import mockSpecialCharsMessage from './fixtures/message-response-specialchars.json';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockRecipients from './fixtures/recipients-response.json';
import mockBlockedRecipientsResponse from './fixtures/recipientsResponse/blocked-recipients-response.json';

describe('recipients dropdown box', () => {
  it('preferredTriageTeam select dropdown default ', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    PatientInterstitialPage.getContinueButton().click();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get(Locators.ALERTS.REPT_SELECT).should('exist');
    cy.get(Locators.ALERTS.REPT_SELECT)
      .find('select')
      .find('option')
      .its('length')
      .should('equal', mockRecipients.data.length + 1);
    cy.get(Locators.ALERTS.MESS_CATAGO)
      .first()
      .click({ force: true });
  });

  it('preferredTriageTeam select dropdown false', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSpecialCharsMessage,
      mockBlockedRecipientsResponse,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});

    // ad assertion to check blocked group does not exist in the dd list

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    PatientInterstitialPage.getContinueButton().click();
    cy.wait('@recipients').then(() => {
      cy.get(Locators.ALERTS.REPT_SELECT)
        .find('select')
        .find('option')
        .its('length')
        .should('equal', mockBlockedRecipientsResponse.data.length);
      cy.get(Locators.ALERTS.REPT_SELECT)
        .first()
        .click();
    });
  });
});
