import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  it('Axe Check Manage Folders', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
