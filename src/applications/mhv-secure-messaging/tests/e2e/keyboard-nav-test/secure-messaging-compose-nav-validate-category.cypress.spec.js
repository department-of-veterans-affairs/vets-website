import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import categories from '../fixtures/categories-response.json';

describe('Validate the category', () => {
  it('selects a category', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const listOfCategories = categories.data.attributes.messageCategoryType;

    site.login();
    landingPage.loadInboxMessages();
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    PatientInterstitialPage.getContinueButton().click();
    cy.tabToElement('[data-testid="edit-preferences-button"]').should(
      'have.focus',
    );
    cy.realPress(['Tab']);
    cy.realPress(['Tab']);

    for (let i = 0; i < listOfCategories.length; i += 1) {
      cy.get(`#compose-message-categories${listOfCategories[i]}input`).should(
        'have.focus',
      );
      cy.realPress('ArrowDown');
    }
    cy.tabToElement('[data-testid="message-subject-field"]').should(
      'have.focus',
    );
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
