import manifest from '../../manifest.json';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Messages FAQ', () => {
    const landingPage = new PatientMessagesInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="messages-faq-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
