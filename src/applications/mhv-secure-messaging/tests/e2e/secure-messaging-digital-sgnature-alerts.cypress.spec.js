import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Digital Signature Error flows', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it("verify user can't send a message without digital signature", () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`);
    PatientComposePage.getMessageBodyField().type(`\nDS tests text`, {
      force: true,
    });

    PatientComposePage.verifyDigitalSignature();
    PatientComposePage.verifyDigitalSignatureRequired();

    cy.get('[data-testid="Send-Button"]').click({ force: true });

    cy.get('#input-error-message').should(
      'contain.text',
      'Enter your full name',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it("verify user can't save a message with digital signature", () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`);
    PatientComposePage.getMessageBodyField().type(`\nDS tests text`, {
      force: true,
    });

    PatientComposePage.verifyDigitalSignature();
    PatientComposePage.verifyDigitalSignatureRequired();
    PatientComposePage.getDigitalSignatureField().type('Dusty Dump ', {
      force: true,
    });

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });

    cy.get('[data-testid="quit-compose-double-dare"]')
      .shadow()
      .find('h2')
      .should('contain', 'save your signature');

    cy.get('[data-testid="quit-compose-double-dare"]')
      .find('va-button')
      .first()
      .should('have.attr', 'text', 'Edit draft');
    cy.get('[data-testid="quit-compose-double-dare"]')
      .find('va-button')
      .last()
      .should('have.attr', 'text', 'Save draft without signature');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it("verify user can't save a message with digital signature and attachment", () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`);
    PatientComposePage.getMessageBodyField().type(`\nDS tests text`, {
      force: true,
    });

    PatientComposePage.verifyDigitalSignature();
    PatientComposePage.verifyDigitalSignatureRequired();
    PatientComposePage.getDigitalSignatureField().type('Dusty Dump ', {
      force: true,
    });
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });

    cy.get('[data-testid="quit-compose-double-dare"]')
      .shadow()
      .find('h2')
      .should('contain', 'save your signature or attachment');

    cy.get('[data-testid="quit-compose-double-dare"]')
      .find('va-button')
      .first()
      .should('have.attr', 'text', 'Edit draft');
    cy.get('[data-testid="quit-compose-double-dare"]')
      .find('va-button')
      .last()
      .should(
        'have.attr',
        'text',
        'Save draft without signature or attachments',
      );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
