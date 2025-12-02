import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { Alerts, AXE_CONTEXT, Data, Locators, Paths } from './utils/constants';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';

describe('SM ATTACHMENT WITH VIRUS ON REPLY', () => {
  const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleThreadResponse,
  );
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();
    PatientReplyPage.getMessageBodyField()
      .focus()
      .clear()
      .type(`Test body`);
  });

  describe('Verify single attachment with virus alert on reply', () => {
    beforeEach(() => {
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_IMG);
      cy.intercept(
        'POST',
        `${Paths.SM_API_EXTENDED}/${
          updatedSingleThreadResponse.data[0].attributes.messageId
        }/reply`,
        {
          statusCode: 400,
          body: { errors: [{ code: 'SM172' }] },
        },
      ).as('failed');
      cy.get(Locators.BUTTONS.SEND)
        .contains('Send')
        .click({ force: true });
    });

    it('verify alert exists and file input remains visible', () => {
      // Verify error message is displayed within VaFileInputMultiple
      cy.get('[data-testid^="attach-file-input"]')
        .should('exist')
        .shadow()
        .find('.usa-error-message')
        .should('contain.text', Alerts.VIRUS_ATTCH);

      // Verify file input component is still present (not hidden)
      cy.get('[data-testid^="attach-file-input"]').should('exist');

      // Verify attach button is visible
      PatientComposePage.attachFileButton().should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Verify multiple attachment with virus alert', () => {
    beforeEach(() => {
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_IMG);
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_XLS);
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);
      cy.intercept(
        'POST',
        `${Paths.SM_API_EXTENDED}/${
          updatedSingleThreadResponse.data[0].attributes.messageId
        }/reply`,
        {
          statusCode: 400,
          body: { errors: [{ code: 'SM172' }] },
        },
      ).as('failed');
      cy.get(Locators.BUTTONS.SEND)
        .contains('Send')
        .click({ force: true });
    });

    it('verify alert exists and file input remains visible', () => {
      // Verify error message is displayed within VaFileInputMultiple for multiple files
      cy.get('[data-testid^="attach-file-input"]')
        .should('exist')
        .shadow()
        .find('.usa-error-message')
        .should('contain.text', Alerts.VIRUS_MULTI_ATTCH);

      // Verify file input component is still present (not hidden)
      cy.get('[data-testid^="attach-file-input"]').should('exist');

      // Verify attach button is visible
      PatientComposePage.attachFileButton().should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
