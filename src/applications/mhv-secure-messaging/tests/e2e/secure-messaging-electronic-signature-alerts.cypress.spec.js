import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Alerts } from './utils/constants';

describe('Secure Messaging Digital Signature Error flows', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`);
    PatientComposePage.getMessageBodyField().type(`\nDS tests text`, {
      force: true,
    });

    PatientComposePage.verifyElectronicSignature();
    PatientComposePage.verifyElectronicSignatureRequired();
    PatientComposePage.verifyESCheckBoxRequired();
  });

  it("verify user can't send a message without electronic signature", () => {
    cy.get(Locators.BUTTONS.SEND).click({ force: true });

    cy.get('#input-error-message').should('contain.text', Alerts.EL_SIGN_NAME);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify user can't send a message without checkbox`, () => {
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });
    cy.get(Locators.BUTTONS.SEND).click({ force: true });
    cy.get(`#checkbox-error-message .usa-error-message`).should(
      `have.text`,
      Alerts.EL_SIGN_CHECK,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify user can't save a message with electronic signature`, () => {
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });

    // TODO clarify `unchecked save draft` behavior
    PatientComposePage.clickElectronicSignatureCheckbox();

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });

    cy.get(Locators.ALERTS.ES_ALERT)
      .shadow()
      .find('h2')
      .should('have.text', Alerts.SAVE_SIGN);

    PatientComposePage.getAlertEditDraftBtn()
      .first()
      .should('have.attr', 'text', Data.BUTTONS.EDIT_DRAFT);
    PatientComposePage.getAlertEditDraftBtn()
      .last()
      .should('have.attr', 'text', Data.BUTTONS.SAVE_DRAFT_WO_SIGN);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.closeESAlertModal();
  });

  it(`verify user can't save a message with electronic signature and attachment`, () => {
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);
    PatientComposePage.clickElectronicSignatureCheckbox();

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });

    cy.get(Locators.ALERTS.ES_ALERT)
      .shadow()
      .find('h2')
      .should('have.text', Alerts.SAVE_SIGN_ATTCH);

    PatientComposePage.getAlertEditDraftBtn()
      .first()
      .should('have.attr', 'text', Data.BUTTONS.EDIT_DRAFT);
    PatientComposePage.getAlertEditDraftBtn()
      .last()
      .should('have.attr', 'text', Data.BUTTONS.SAVE_DRAFT_WO_SIGN_ATTCH);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.closeESAlertModal();
  });
});
