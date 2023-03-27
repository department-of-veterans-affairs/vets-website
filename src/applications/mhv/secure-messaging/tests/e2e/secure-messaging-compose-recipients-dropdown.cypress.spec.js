import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
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
  ],
};

describe('recipients dropdown box', () => {
  it('preferredTriageTeam selcet dropdown ', () => {
    const landingPage = new PatientInboxPage();
    // const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      recipientsResponseDefault,
    ).as('recipients');
    cy.get('[data-testid="compose-recipient-select"]').should('exist');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      recipientsResponseFalse,
    ).as('recipients');
    cy.get('[data-testid="compose-recipient-select"]').should('have.length', 1);
    cy.get('[data-testid="compose-recipient-select"]')
      .find('[id="select"]')
      .should('have.length', 0);
    cy.get('[name="COVID"]').click();
  });
});
