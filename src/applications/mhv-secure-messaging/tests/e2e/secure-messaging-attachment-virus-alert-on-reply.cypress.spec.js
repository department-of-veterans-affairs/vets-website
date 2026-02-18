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

    it('verify alert exist and attach button disappears', () => {
      cy.get(Locators.ALERTS.ATTCH_VIRUS)
        .should(`be.visible`)
        .and(`contain`, Alerts.VIRUS_ATTCH);

      cy.get(Locators.ATTACH_FILE_INPUT).should(`not.exist`);
      cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT).should('be.focused');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);

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
