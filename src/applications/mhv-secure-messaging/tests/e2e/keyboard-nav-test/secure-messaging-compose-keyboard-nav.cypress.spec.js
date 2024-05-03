import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';

describe('Secure Messaging Compose Form Keyboard Nav', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('Tab to Message Body', () => {
    landingPage.navigateToComposePage();
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
    landingPage.navigateToComposePage();
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
