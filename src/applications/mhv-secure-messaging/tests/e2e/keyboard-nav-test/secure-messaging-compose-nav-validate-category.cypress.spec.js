import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import categories from '../fixtures/categories-response.json';

describe('Validate the category', () => {
  it('verify category focus', () => {
    const listOfCategories = categories.data.attributes.messageCategoryType;

    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click();
    PatientInterstitialPage.getContinueButton().click();
    cy.get('[data-testid="secure-messaging"]')
      .find('h1')
      .should('have.focus');

    for (let i = 0; i < listOfCategories.length; i += 1) {
      cy.get(`#compose-message-categories${listOfCategories[i]}input`)
        .click({ force: true })
        .should('have.focus');
    }

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
