import manifest from '../../manifest.json';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientMessagesInboxPage();
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
