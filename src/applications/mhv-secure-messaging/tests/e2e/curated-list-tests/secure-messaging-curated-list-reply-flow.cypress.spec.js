import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import PatientReplyPage from '../pages/PatientReplyPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import singleThreadResponse from '../fixtures/thread-response-new-api.json';

describe('SM CURATED LIST REPLY FLOW WITH INTERSTITIAL', () => {
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

  it('verify reply shows "Continue to reply" link with curated flow enabled', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );

    // Navigate to a message thread
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);

    // Verify we're on interstitial page
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );

    // Verify the start-message-link exists (new flow)
    PatientInterstitialPage.getStartMessageLink().should('be.visible');

    // Verify it shows "Continue to reply" text
    PatientInterstitialPage.getStartMessageLink().should(
      'have.attr',
      'text',
      'Continue to reply',
    );

    // Verify it's a primary action link
    PatientInterstitialPage.getStartMessageLink().should(
      'have.attr',
      'type',
      'primary',
    );

    // Verify old continue-button does NOT exist
    PatientInterstitialPage.getContinueButton().should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify clicking "Continue to reply" link does not navigate away from reply page', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );

    // Navigate to reply
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);

    // Store current path (should be /reply/message-id/)
    cy.location('pathname').then(replyPath => {
      // Click the continue to reply link
      PatientInterstitialPage.getStartMessageLink().click();

      // Verify we stayed on the same reply path (didn't navigate to recent/select care team)
      cy.location('pathname').should('equal', replyPath);
      cy.location('pathname').should('include', '/reply/');

      // Verify reply form is visible (interstitial is now hidden, form is shown)
      PatientReplyPage.getMessageBodyField().should('be.visible');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  it('verify reply flow works end-to-end with curated list flow', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    const singleMessage = { data: updatedSingleThreadResponse.data[0] };

    // Navigate to message and click reply
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);

    // Click continue to reply
    PatientInterstitialPage.getStartMessageLink().click();

    // Fill out and send reply
    PatientReplyPage.getMessageBodyField()
      .clear()
      .type('Test reply body', { force: true });

    PatientReplyPage.clickSendReplyMessageButton(singleMessage);

    cy.get(Locators.SPINNER).should('be.visible');

    PatientReplyPage.verifySendMessageConfirmationMessageText();
    PatientReplyPage.verifySendMessageConfirmationHasFocus();

    cy.get(Locators.SPINNER).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify keyboard navigation with Enter key on reply link', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );

    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);

    // Tab to the start message link and press Enter
    cy.tabToElement(`[data-testid=${Locators.LINKS.START_NEW_MESSAGE}]`);
    cy.realPress(['Enter']);

    // Verify we're on reply page
    cy.location('pathname').should('include', '/reply/');
    PatientReplyPage.getMessageBodyField().should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify crisis line content is present on reply interstitial', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );

    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);

    // Verify urgent communications section exists
    cy.contains(
      'If you need help sooner, use one of these urgent communications options:',
    ).should('be.visible');

    // Verify crisis line button exists
    cy.get('[text="Connect with the Veterans Crisis Line"]').should('exist');

    // Verify 911 content exists
    cy.contains('If you think your life or health is in danger').should(
      'be.visible',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
