import manifest from '../../manifest.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Custom Folder List', () => {
    const landingPage = new PatientInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
