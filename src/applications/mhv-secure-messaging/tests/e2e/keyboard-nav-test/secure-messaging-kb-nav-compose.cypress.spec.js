import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('Secure Messaging Compose Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  afterEach(() => {
    PatientComposePage.backToInbox();
  });

  it('Tab to Message Subject Field', () => {
    PatientInboxPage.navigateToComposePage();
    GeneralFunctionsPage.verifyPageHeader(`Start a new message`);
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientComposePage.keyboardNavToMessageSubjectField().should('exist');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Tab to Message Body', () => {
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.keyboardNavToMessageBodyField().should('exist');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
