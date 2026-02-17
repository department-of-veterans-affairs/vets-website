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
      cy.intercept('POST', Paths.SM_API_EXTENDED, {
        statusCode: 400,
        body: { errors: [{ code: 'SM172' }] },
      }).as('failed');
      cy.get(Locators.BUTTONS.SEND).contains('Send').click({ force: true });
    });

    it('verify alert exist and attach button disappears', () => {
      cy.get(Locators.ALERTS.ATTCH_VIRUS)
        .should(`be.visible`)
        .and(`contain`, Alerts.VIRUS_ATTCH);

      cy.get(Locators.ATTACH_FILE_INPUT).should(`not.exist`);
      cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT).should('be.focused');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it(`verify attach button back`, () => {
      cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT).click({ force: true });
      cy.get(Locators.BUTTONS.CONFIRM_REMOVE_ATTACHMENT)
        .should(`be.visible`)
        .then(btn => {
          return new Cypress.Promise(resolve => {
            setTimeout(resolve, 2000);
            cy.wrap(btn).click();
          });
        });

      PatientComposePage.attachFileButton().should(`exist`);
      PatientComposePage.attachFileButton().should(`be.focused`);

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Verify multiple attachment with virus alert', () => {
    beforeEach(() => {
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_IMG);
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_XLS);
      PatientComposePage.attachMessageFromFile(Data.SAMPLE_PDF);

      cy.intercept('POST', Paths.SM_API_EXTENDED, {
        statusCode: 400,
        body: { errors: [{ code: 'SM172' }] },
      }).as('failed');
      cy.get(Locators.BUTTONS.SEND).contains('Send').click({ force: true });
    });

    it('verify alert exist and attach button disappears', () => {
      cy.get(Locators.ALERTS.ATTCH_VIRUS)
        .should(`be.visible`)
        .and(`contain`, Alerts.VIRUS_MULTI_ATTCH);
      cy.get(Locators.ATTACH_FILE_INPUT).should(`not.exist`);
      cy.get(Locators.BUTTONS.REMOVE_ALL_ATTCH).should('be.focused');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it(`verify attach button back`, () => {
      cy.get(Locators.BUTTONS.REMOVE_ALL_ATTCH)
        .should(`be.visible`)
        .then(btn => {
          return new Cypress.Promise(resolve => {
            setTimeout(resolve, 2000);
            cy.wrap(btn).click();
          });
        });

      PatientComposePage.attachFileButton().should(`exist`);
      PatientComposePage.attachFileButton().should(`be.focused`);

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
