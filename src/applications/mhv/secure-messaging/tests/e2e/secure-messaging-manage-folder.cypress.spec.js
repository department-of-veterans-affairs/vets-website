import manifest from '../../manifest.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Manage Folders', () => {
    const landingPage = new PatientInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
