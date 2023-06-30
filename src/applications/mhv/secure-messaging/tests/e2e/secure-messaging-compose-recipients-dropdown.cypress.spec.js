import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import mockSpecialCharsMessage from './fixtures/message-response-specialchars.json';
import mockMessages from './fixtures/messages-response.json';
// import PatientComposePage from './pages/PatientComposePage';

const recipientsResponseDefault = {
  data: [
    {
      id: '7026562',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 7026562,
        name: '###ABC_XYZ_TRIAGE_TEAM_PCMM_ASSOCIATION_747###',
        relationType: 'PATIENT',
        preferredTeam: true,
      },
    },
    {
      id: '7026564',
      type: 'triage_teams',
      attributes: {
        triageTeamId: 7026564,
        name: 'test',
        relationType: 'family',
        preferredTeam: true,
      },
    },
  ],
};
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
  it('preferredTriageTeam selcet dropdown default ', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      mockSpecialCharsMessage,
      recipientsResponseDefault,
    );

    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.get('[data-testid="compose-recipient-select"]').should('exist');
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('option')
      .its('length')
      .should('equal', 3);
    cy.get('[name="COVID"]').click();
  });
  it('preferredTriageTeam selcet dropdown false', () => {
    const landingPage = new PatientInboxPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      mockSpecialCharsMessage,
      recipientsResponseFalse,
    );
    cy.get('[data-testid="compose-message-link"]').click();
    patientInterstitialPage.getContinueButton().click();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      recipientsResponseFalse,
    ).as('recipients');
    cy.wait('@recipients').then(() => {
      cy.get('[data-testid="compose-recipient-select"]')
        .find('option')
        .filter(':visible')
        .its('length')
        .should('equal', 1);
      cy.get('[name="COVID"]').click();
    });
  });
});
