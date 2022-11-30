import manifest from '../../manifest.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe.skip(manifest.appName, () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientMessagesLandingPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    messageDetailsPage.loadReplyPage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
