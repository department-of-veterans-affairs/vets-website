import { expect } from 'chai';
import { dateFormat } from '../../../util/helpers';
import mockMessage from '../fixtures/message-response.json';
import { Locators, Paths, Data } from '../utils/constants';

class PatientReplyPage {
  clickReplyButton = mockResponse => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${mockResponse.data[0].attributes.messageId}/thread*`,
      mockResponse,
    ).as(`getMessageRequest`);
    cy.get(Locators.BUTTONS.REPLY).click();
  };

  clickSendReplyMessageButton = mockReplyMessage => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGES}/${mockReplyMessage.data.attributes.messageId}/reply`,
      mockReplyMessage,
    ).as('replyMessage');
    cy.get(Locators.BUTTONS.SEND).click();
  };

  clickSaveReplyDraftButton = (mockSingleMessage, updatedBodyText) => {
    const replyMessage = mockSingleMessage;
    replyMessage.data.attributes.body = updatedBodyText;
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/message_drafts/${mockSingleMessage.data.attributes.messageId}/replydraft`,
      replyMessage,
    ).as('replyDraftMessage');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click();
    cy.wait('@replyDraftMessage').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });

    cy.get('@replyDraftMessage')
      .its('request.body')
      .then(message => {
        cy.log(JSON.stringify(message));
        expect(message.recipientId).to.eq(
          replyMessage.data.attributes.senderId,
        );
        expect(message.category).to.eq(replyMessage.data.attributes.category);
        expect(message.subject).to.eq(replyMessage.data.attributes.subject);
        expect(message.body).to.contain(updatedBodyText);
      });
  };

  clickSendReplyDraftButton = (
    messageId,
    testRecipientId,
    testCategory,
    testSubject,
    testBody,
  ) => {
    mockMessage.data.attributes.recipientId = testRecipientId;
    mockMessage.data.attributes.category = testCategory;
    mockMessage.data.attributes.subject = testSubject;
    mockMessage.data.attributes.body = testBody;
    cy.log(`messageId = ${messageId}`);
    cy.log(`messageSubjectParameter = ${testSubject}`);
    cy.log(
      `messageSubjectMockMessage = ${mockMessage.data.attributes.subject}`,
    );
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGES}/${mockMessage.data.attributes.messageId}/reply`,
      mockMessage,
    ).as('replyDraftMessage');

    cy.get(Locators.BUTTONS.SEND).click();
    cy.wait('@replyDraftMessage').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get('@replyDraftMessage')
      .its('request.body')
      .then(message => {
        cy.log(JSON.stringify(message));
        expect(message.recipient_id).to.eq(testRecipientId);
        expect(message.category).to.eq(testCategory);
        expect(message.subject).to.eq(testSubject);
        expect(message.body).to.eq(`${testBody}`);
      });
  };

  getMessageBodyField = () => {
    return cy
      .get(Locators.FIELDS.MESSAGE_BODY)
      .shadow()
      .find(`#input-type-textarea`);
  };

  verifySendMessageConfirmationMessageText = () => {
    cy.get(Locators.ALERTS.GEN_ALERT).should(
      'include.text',
      Data.SECURE_MSG_SENT_SUCCESSFULLY,
    );
  };

  verifySendMessageConfirmationHasFocus = () => {
    cy.get('va-alert').should('have.focus');
  };

  verifyExpandedMessageDate = (messageDetails, messageIndex = 0) => {
    cy.log(`messageIndex = ${messageIndex}`);
    if (messageIndex === 0) {
      cy.log('message index = 0');
      cy.get(Locators.MSG_DATE)
        .eq(messageIndex)
        .should(
          'have.text',
          `Date: ${dateFormat(
            messageDetails.data.attributes.sentDate,
            'MMMM D, YYYY [at] h:mm a z',
          )}`,
        );
    } else {
      cy.get(Locators.MSG_DATE)
        .eq(messageIndex)
        .should(
          'have.text',
          `${dateFormat(
            messageDetails.data.attributes.sentDate,
            'MMMM D, YYYY, [at] h:mm a z',
          )}`,
        );
    }
  };

  verifyModalMessageDisplayAndButtonsCantSaveDraft = () => {
    cy.contains("We can't save this message yet").should('be.visible');

    cy.contains('Continue editing').should('be.visible');
    cy.contains('Delete draft').should('be.visible');
  };

  verifyReplyHeader = (text = `Draft`) => {
    cy.get(Locators.REPLY_FORM)
      .find(`h2`)
      .should(`be.visible`)
      .and(`have.text`, text);
  };

  verifyEditReplyDraftBtn = (text = Data.BUTTONS.EDIT_DRAFT_REPLY) => {
    cy.get(Locators.BUTTONS.EDIT_DRAFT)
      .should(`be.visible`)
      .and(`contain.text`, text);
  };
}

export default new PatientReplyPage();
