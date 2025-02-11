import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data, Alerts, Paths } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import mhvPage from '../pages/MhvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM USER NO ASSOCIATION AT ALL', () => {
  it('verify new message through link', () => {
    SecureMessagingSite.login();
    mhvPage.loadHomePage(mockFeatureToggles, Paths.MHV_MAIN, mockNoRecipients);

    cy.contains('Start a new message').click();

    cy.get(Locators.ALERTS.NO_ASSOCIATION)
      .find(`h2`)
      .should(`have.text`, Alerts.NO_ASSOCIATION_RED.AT_ALL_HEADER);

    cy.get(Locators.ALERTS.NO_ASSOCIATION)
      .find(`p`)
      .should(`contain.text`, Alerts.NO_ASSOCIATION_RED.PARAGRAPH);

    cy.get(Locators.ALERTS.NO_ASSOCIATION)
      .find(`a`)
      .should(`have.attr`, `href`, Data.FAQ_LINK.URL.FACILITY);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify new message using direct url', () => {
    SecureMessagingSite.login();
    mhvPage.loadHomePage(mockFeatureToggles, Paths.MHV_MAIN, mockNoRecipients);

    cy.visit(`/my-health/secure-messages/new-message/`);

    GeneralFunctionsPage.verifyPageHeader(Data.START_NEW_MSG);

    cy.get(Locators.ALERTS.NO_ASSOCIATION)
      .find(`h2`)
      .should(`have.text`, Alerts.NO_ASSOCIATION_RED.AT_ALL_HEADER);

    cy.get(Locators.ALERTS.NO_ASSOCIATION)
      .find(`p`)
      .should(`contain.text`, Alerts.NO_ASSOCIATION_RED.PARAGRAPH);

    cy.get(Locators.ALERTS.NO_ASSOCIATION)
      .find(`a`)
      .should(`have.attr`, `href`, Data.FAQ_LINK.URL.FACILITY);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
