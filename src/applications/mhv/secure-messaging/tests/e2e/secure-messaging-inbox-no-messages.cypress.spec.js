import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('inbox no messages', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadEmptyPage(false);
    cy.get('[data-testid=alert-no-messages] p')
      .should('have.text', 'There are no messages in this folder.')
      .should('be.visible');
    cy.injectAxe();
    cy.axeCheck();
  });
});
