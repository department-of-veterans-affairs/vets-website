import manifest from '../../manifest.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
