import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('validate selction of folder from dropdown', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  site.login();
  landingPage.loadPage();
  it('dropdown navigtion using keyboard', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
