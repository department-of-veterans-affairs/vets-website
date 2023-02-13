import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Manage Folder AXE check', () => {
  it('Axe Check Manage Folders', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.get('[text="Create new folder"]')
      .shadow()
      .find('[type="button"]')
      .click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
