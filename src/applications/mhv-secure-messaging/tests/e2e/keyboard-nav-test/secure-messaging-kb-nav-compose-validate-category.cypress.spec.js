import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import categories from '../fixtures/categories-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('Validate the category', () => {
  it('verify category focus', () => {
    const listOfCategories = categories.data.attributes.messageCategoryType;

    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    PatientInterstitialPage.getContinueButton().click();
    GeneralFunctionsPage.verifyHeaderFocused();

    cy.tabToElement(`#compose-message-categories${listOfCategories[0]}input`);

    for (let i = 0; i < listOfCategories.length; i += 1) {
      cy.get(`#compose-message-categories${listOfCategories[i]}input`).should(
        'have.focus',
      );
      cy.realPress(`ArrowDown`);
    }

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.backToInbox();
    PatientComposePage.clickDeleteDraftModalButton();
  });
});
