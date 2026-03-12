import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockInboxNoMessages from './fixtures/empty-thread-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Inbox No Messages', () => {
  it('inbox no messages', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockInboxNoMessages);

    cy.findByText('Showing 0 of 0 conversations').should('be.visible');
    cy.get(Locators.NO_MESS).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
