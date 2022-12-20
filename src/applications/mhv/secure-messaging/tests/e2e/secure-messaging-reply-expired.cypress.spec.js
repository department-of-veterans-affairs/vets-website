import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getExpired46DayOldMessage().attributes.messageId,
      landingPage.getExpired46DayOldMessage().attributes.subject,
      landingPage.getExpired46DayOldMessage().attributes.sentDate,
    );

    cy.get('[data-testid=expired-alert-message]').should(
      'have.text',
      'You cannot reply to a message that is older than 45 days.',
    );
    cy.get('[data-testid=expired-alert-message]+p').should(
      'have.text',
      "Please select 'Compose' to create a new message.",
    );

    cy.injectAxe();
    cy.axeCheck();
  });
});
