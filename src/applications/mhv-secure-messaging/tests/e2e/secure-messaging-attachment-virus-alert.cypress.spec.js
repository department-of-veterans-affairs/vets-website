import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Paths, Alerts } from './utils/constants';

describe(`SM ATTACHMENT WITH VIRUS TESTS`, () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT);
    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
  });

  describe('Verify single attachment with virus alert', () => {
    beforeEach(() => {
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_IMG);
      // Wait for attachment to be added - verify button text changes
      PatientComposePage.attachFileButton().should(
        'have.attr',
        'button-text',
        'Attach additional file',
      );
      cy.intercept('POST', Paths.SM_API_EXTENDED, {
        statusCode: 400,
        body: { errors: [{ code: 'SM172' }] },
      }).as('failed');
      cy.get(Locators.BUTTONS.SEND)
        .contains('Send')
        .click({ force: true });
      // Wait for the POST request to complete
      cy.wait('@failed');
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
      // Wait for all attachments to be added - verify button text changes
      PatientComposePage.attachFileButton().should(
        'have.attr',
        'button-text',
        'Attach additional file',
      );
      cy.intercept('POST', Paths.SM_API_EXTENDED, {
        statusCode: 400,
        body: { errors: [{ code: 'SM172' }] },
      }).as('failed');
      cy.get(Locators.BUTTONS.SEND)
        .contains('Send')
        .click({ force: true });
      // Wait for the POST request to complete
      cy.wait('@failed');
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
