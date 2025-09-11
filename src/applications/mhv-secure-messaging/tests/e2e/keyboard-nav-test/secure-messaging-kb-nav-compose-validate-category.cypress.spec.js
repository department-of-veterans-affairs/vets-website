import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('Validate the category', () => {
  it('verify category dropdown is keyboard accessible', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
    PatientInterstitialPage.getContinueButton().click();
    GeneralFunctionsPage.verifyHeaderFocused();

    cy.tabToElement('[data-testid="compose-message-categories"]');
    cy.get('[data-testid="compose-message-categories"]').should('be.focused');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.backToInbox();
  });
});
