import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import mockSpecialCharsMessage from './fixtures/message-response-specialchars.json';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT } from './utils/constants';
import mockRecipients from './fixtures/recipients-response.json';

const recipientsResponseFalse = {
  data: [
    {
      id: '7026563',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 7026563,
        name: '###ABC_XYZ_TRIAGE_TEAM_PCMM_ASSOCIATION_747###',
        relationType: 'PATIENT',
        preferredTeam: false,
      },
    },
    {
      id: '7026564',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 7026564,
        name: 'test',
        relationType: 'family',
        preferredTeam: false,
      },
    },
  ],
};

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
      recipientsResponseFalse,
    );
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
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/allrecipients?useCache=false',
      recipientsResponseFalse,
    ).as('recipients');
    cy.wait('@recipients').then(() => {
      cy.get('[data-testid="compose-recipient-select"]')
        .find('select')
        .find('option')
        // filtering not required. all elements should be visible due to inheritance from parent element
        // .filter(':visible', { timeout: 5000 })
        .its('length')
        .should('equal', 1);
      cy.get('[data-testid="compose-message-categories"]')
        .first()
        .click();
    });
  });
});
