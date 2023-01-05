import manifest from '../../manifest.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Messages FAQ', () => {
    const landingPage = new PatientInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="messages-faq-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
