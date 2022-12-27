import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  it('Basic Search Axe Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPageNoMessages();
    // check for message here
    cy.injectAxe();
    cy.axeCheck();
  });
});
