import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import mockMessages from './fixtures/threads-response.json';
import mockSingleMessage from './fixtures/inboxResponse/single-message-response.json';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('SM MESSAGING COMPOSE', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();
  });

  it('verify interface', () => {
    PatientComposePage.verifyHeader(Data.START_NEW_MSG);

    PatientComposePage.verifyAdditionalInfoDropdownStatus(`false`);

    PatientComposePage.openRecipientsDropdown();

    PatientComposePage.verifyAdditionalInfoDropdownStatus(`true`);

    cy.get(Locators.DROPDOWN.ADD_INFO).should(`be.visible`);

    PatientComposePage.verifyAdditionalInfoDropdownLinks();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can send a message', () => {
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBody);
    cy.get(Locators.SPINNER).should('be.visible');
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
    cy.get(Locators.SPINNER).should('not.exist');

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
    cy.findByTestId(Locators.FIELDS.MESSAGE_SUBJECT_DATA_TEST_ID).should(
      'have.attr',
      'value',
      `${maxText}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

describe('COMPOSE WITH PLAIN TG NAMES', () => {
  const updatedMockRecipientsResponse = GeneralFunctionsPage.updateTGSuggestedName(
    mockRecipients,
    'TG | Type | Name',
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      updatedMockRecipientsResponse,
    );
    PatientInboxPage.navigateToComposePage();
  });

  it('verify recipients list indicates suggested TG name', () => {
    cy.get(`#options`)
      .find(
        `[value=${
          updatedMockRecipientsResponse.data[0].attributes.triageTeamId
        }]`,
      )
      .should(
        `have.text`,
        `${
          updatedMockRecipientsResponse.data[0].attributes.suggestedNameDisplay
        }`,
      );
    cy.injectAxeThenAxeCheck();
  });
});
