import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockEhrData from './fixtures/userResponse/vamc-ehr-cerner-mixed.json';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const site = new SecureMessagingSite();
    const patientInboxPage = new PatientInboxPage();
    site.login(mockEhrData, false);
    site.loadPageUnauthenticated();

    cy.url().should('contain', '/health-care/secure-messaging');

    site.login();

    patientInboxPage.loadInboxMessages();
    cy.get(Locators.FOLDERS.SIDEBAR).click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
