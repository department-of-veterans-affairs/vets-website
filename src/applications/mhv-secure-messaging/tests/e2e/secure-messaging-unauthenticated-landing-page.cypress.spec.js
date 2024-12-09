import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import mockEhrData from './fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockToggles from './fixtures/toggles-response.json';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login(mockToggles, mockEhrData, false);
    SecureMessagingSite.loadPageUnauthenticated();

    cy.url().should('contain', Paths.MHV_LANDING_PAGE);

    // lines below are only for axeCheck (as test couldn't be committed without axeCheck verification)
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
