import manifest from '../../manifest.json';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe(manifest.appName, () => {
  it('Axe Check Sent Folder', () => {
    const landingPage = new PatientMessagesInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-1', mockMessages).as(
      'sentResponse',
    );
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
