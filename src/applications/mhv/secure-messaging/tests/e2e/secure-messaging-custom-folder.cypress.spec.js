import manifest from '../../manifest.json';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';

describe(manifest.appName, () => {
  it('Axe Check Custom Folder List', () => {
    const landingPage = new PatientMessagesInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
