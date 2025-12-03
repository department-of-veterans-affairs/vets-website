import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';

describe('SM CURATED LIST KEYBOARD NAVIGATION TO COMPOSE', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: featureFlagNames.mhvSecureMessagingRecentRecipients,
        value: true,
      },
      {
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
  });

  it('validate user can navigate to compose page with recent recipients via keyboard', () => {
    // Set up intercept for recent recipients
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      searchSentFolderResponse,
    ).as('recentRecipients');

    cy.tabToElement(Locators.LINKS.CREATE_NEW_MESSAGE);
    cy.realPress(['Enter']);

    cy.wait('@recentRecipients');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInterstitialPage.getStartMessageLink().should('be.visible');

    cy.tabToElement(`[data-testid=${Locators.LINKS.START_NEW_MESSAGE}]`);
    cy.realPress(['Enter']);

    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    cy.get('h1')
      .should('be.focused')
      .and('have.text', Data.RECENT_RECIPIENTS_HEADER);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('validate user can navigate to compose page without recent recipients via keyboard', () => {
    // Set up intercept with no recent recipients
    const modifiedSearchResponse = { data: [] };
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      modifiedSearchResponse,
    ).as('recentRecipients');

    cy.tabToElement(Locators.LINKS.CREATE_NEW_MESSAGE);
    cy.realPress(['Enter']);

    // Wait for recent recipients to load (empty response)
    cy.wait('@recentRecipients');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInterstitialPage.getStartMessageLink().should('be.visible');

    cy.tabToElement(`[data-testid=${Locators.LINKS.START_NEW_MESSAGE}]`);
    cy.realPress(['Enter']);

    GeneralFunctionsPage.verifyPageHeader('Select care team');

    cy.get('h1')
      .should('be.focused')
      .and('have.text', 'Select care team');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
