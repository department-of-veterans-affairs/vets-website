import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';

describe('Secure Messaging Compose Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Tab to Message Body', () => {
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.keyboardNavToMessageBodyField().should('exist');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('Tab to Message Subject Field', () => {
    PatientInboxPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientComposePage.keyboardNavToMessageSubjectField().should('exist');
  });
});
