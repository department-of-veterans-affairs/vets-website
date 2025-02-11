import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT /* Locators, Alerts, Paths */ } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import mhvPage from '../pages/MhvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM USER NO ASSOCIATION AT ALL', () => {
  it('verify new message through link', () => {
    SecureMessagingSite.login();
    mhvPage.loadHomePage(mockFeatureToggles, `/my-health/`, mockNoRecipients);

    cy.contains('Start a new message').click();

    GeneralFunctionsPage.verifyPageHeader(`Start a new message`);
    cy.get(`#track-your-status-on-mobile`).should(
      `have.text`,
      `You’re not connected to any care teams in this messaging tool`,
    );
    cy.get('.vads-u-margin-y--0').should(
      `contain.text`,
      `If you need to contact your care team, call your VA health facility`,
    );
    cy.get('.hydrated > .vads-u-font-weight--bold').should(
      `have.attr`,
      `href`,
      `/find-locations/`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify new message using direct url', () => {
    SecureMessagingSite.login();
    mhvPage.loadHomePage(mockFeatureToggles, `/my-health/`, mockNoRecipients);

    cy.visit(`/my-health/secure-messages/new-message/`);

    GeneralFunctionsPage.verifyPageHeader(`Start a new message`);
    cy.get(`#track-your-status-on-mobile`).should(
      `have.text`,
      `You’re not connected to any care teams in this messaging tool`,
    );
    cy.get('.vads-u-margin-y--0').should(
      `contain.text`,
      `If you need to contact your care team, call your VA health facility`,
    );
    cy.get('.hydrated > .vads-u-font-weight--bold').should(
      `have.attr`,
      `href`,
      `/find-locations/`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
