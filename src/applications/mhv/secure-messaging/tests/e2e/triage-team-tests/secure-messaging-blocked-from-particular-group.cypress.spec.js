import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
// import mockBlockedRecipients from '../fixtures/recipientsResponse/blocked-recipients-response.json';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
