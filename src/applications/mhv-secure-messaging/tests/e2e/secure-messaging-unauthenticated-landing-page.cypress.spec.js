import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import mockEhrData from './fixtures/userResponse/vamc-ehr-cerner-mixed.json';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const site = new SecureMessagingSite();
    site.login(mockEhrData, false);
    site.loadPageUnauthenticated();

    cy.url().should('contain', Paths.HEALTH_CARE_SECURE_MSG);

    site.login();

    PatientInboxPage.loadInboxMessages();
    cy.get(Locators.FOLDERS.SIDEBAR).click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
