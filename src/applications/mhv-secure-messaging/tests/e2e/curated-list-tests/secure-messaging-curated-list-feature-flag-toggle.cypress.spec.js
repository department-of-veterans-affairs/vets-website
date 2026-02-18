import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import PatientReplyPage from '../pages/PatientReplyPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT } from '../utils/constants';
import singleThreadResponse from '../fixtures/thread-response-new-api.json';

describe('SM CURATED LIST FEATURE FLAG TOGGLE VERIFICATION', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
  });

  it('verify compose interstitial shows link (not button) when flag is ON', () => {
    // Click create new message to get to interstitial page
    PatientInboxPage.clickCreateNewMessage();

    // Verify we're on the interstitial page
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );

    // Verify NEW FLOW: start-message-link exists
    PatientInterstitialPage.getStartMessageLink()
      .should('be.visible')
      .and('have.attr', 'text', 'Continue to start message')
      .and('have.attr', 'type', 'primary');

    PatientInterstitialPage.getContinueButton().should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify reply interstitial shows link when flag is ON', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );

    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);

    // Verify NEW FLOW: start-message-link exists with "Continue to reply" text
    PatientInterstitialPage.getStartMessageLink()
      .should('be.visible')
      .and('have.attr', 'text', 'Continue to reply')
      .and('have.attr', 'type', 'primary');

    // Verify OLD FLOW: continue-button does NOT exist
    PatientInterstitialPage.getContinueButton().should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
