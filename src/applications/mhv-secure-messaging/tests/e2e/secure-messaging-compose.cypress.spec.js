import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';

describe('Secure Messaging Compose', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('verify interface', () => {
    // verify header
    cy.get(Locators.HEADER).should(`have.text`, Data.START_NEW_MSG);

    // verify DD visible and closed
    cy.get(`va-additional-info[trigger^="If you"]`)
      .shadow()
      .find(`a`)
      .should(`have.attr`, `aria-expanded`, `false`);

    // open DD list
    cy.get(`va-additional-info[trigger^="If you"]`)
      .shadow()
      .find(`a`)
      .click({ force: true });

    // verify DD opened
    cy.get(`va-additional-info[trigger^="If you"]`)
      .shadow()
      .find(`a`)
      .should(`have.attr`, `aria-expanded`, `true`);
    // verify DD content is visible
    cy.get(`va-additional-info[trigger^="If you"]`).should(`be.visible`);

    // verify MHV Classic link won't open in new window
    cy.get(`va-additional-info[trigger^="If you"]`)
      .find(`a[href$="preferences"]`)
      .should('not.have.attr', `target`, `_blank`);

    // cy.injectAxe();
    // cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can send a message', () => {
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBody);
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify subject field max size', () => {
    const charsLimit = 50;
    const normalText = 'Qwerty1234';
    const maxText = 'Qwerty1234Qwerty1234Qwerty1234Qwerty1234Qwerty1234';

    cy.get(Locators.FIELDS.SUBJECT).should(
      'have.attr',
      'maxlength',
      `${charsLimit}`,
    );

    PatientComposePage.getMessageSubjectField().type(normalText, {
      waitForAnimations: true,
    });
    cy.get(Locators.INFO.SUBJECT_LIMIT).should(
      'have.text',
      `${charsLimit - normalText.length} characters left`,
    );

    PatientComposePage.getMessageSubjectField()
      .clear()
      .type(maxText, { waitForAnimations: true });
    cy.get(Locators.INFO.SUBJECT_LIMIT).should(
      'have.text',
      `${charsLimit - maxText.length} characters left`,
    );

    PatientComposePage.getMessageSubjectField()
      .clear()
      .type(maxText, { waitForAnimations: true });
    cy.get(Locators.FIELDS.MESS_SUBJECT).should(
      'have.attr',
      'value',
      `${maxText}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
