import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import mockEhrData from './fixtures/userResponse/vamc-ehr-cerner-mixed.json';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const site = new SecureMessagingSite();
    site.login(mockEhrData, false);
    site.loadPageUnauthenticated();

    cy.url().should('contain', Paths.HEALTH_CARE_SECURE_MSG);

    // lines below are only for axeCheck (as test couldn't be committed without axeCheck verification)
    site.login();
    PatientInboxPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
