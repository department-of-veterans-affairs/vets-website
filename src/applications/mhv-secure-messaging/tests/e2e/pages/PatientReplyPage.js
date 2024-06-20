import { expect } from 'chai';
import { dateFormat } from '../../../util/helpers';
import mockMessage from '../fixtures/message-response.json';
import { Locators, Paths } from '../utils/constants';

class PatientReplyPage {
  clickSendReplyMessageButton = messageId => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGES}/${messageId}/reply`,
      mockMessage,
    ).as('replyMessage');
    cy.get(Locators.BUTTONS.SEND).click();
    cy.wait('@replyMessage');
  };

  clickSendReplyMessageDetailsButton = mockReplyMessage => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockMessage.data.attributes.messageId
      }/reply`,
      mockReplyMessage,
    ).as('replyMessage');
    cy.get(Locators.BUTTONS.SEND).click();
  };

  clickSaveReplyDraftButton = (repliedToMessage, replyMessageBody) => {
    cy.log(
      `messageSubjectParameter = ${repliedToMessage.data.attributes.subject}`,
    );
    cy.log(`messageBodyMockMessage = ${repliedToMessage.data.attributes.body}`);
    const replyMessage = repliedToMessage;
    replyMessage.data.attributes.body = replyMessageBody;
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/message_drafts/${
        repliedToMessage.data.attributes.messageId
      }/replydraft`,
      replyMessage,
    ).as('replyDraftMessage');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({
      waitForAnimations: true,
    });
    cy.wait('@replyDraftMessage').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });

    // cy.log("request boydy = "+JSON.stringify(cy.get('@replyDraftMessage').its('request.body')));
    cy.get('@replyDraftMessage')
      .its('request.body')
      .then(message => {
        cy.log(JSON.stringify(message));
        expect(message.recipientId).to.eq(
          replyMessage.data.attributes.senderId,
        );
        expect(message.category).to.eq(replyMessage.data.attributes.category);
        expect(message.subject).to.eq(replyMessage.data.attributes.subject);
        expect(message.body).to.contain(replyMessageBody);
        // data-testid="Save-Draft-Button"
        // Your message was saved on February 17, 2023 at 12:21 p.m. CST.
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
      `${Paths.INTERCEPT.MESSAGES}/${
        mockMessage.data.attributes.messageId
      }/reply`,
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
      .get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[name="reply-message-body"]');
  };

  verifySendMessageConfirmationMessageText = () => {
    cy.get('[data-testid="alert-text"]').should(
      'contain.text',
      'Secure message was successfully sent.',
    );
  };

  verifySendMessageConfirmationHasFocus = () => {
    cy.get('va-alert').should('have.focus');
  };

  verifyExpandedMessageDate = (messageDetails, messageIndex = 0) => {
    cy.log(`messageIndex = ${messageIndex}`);
    if (messageIndex === 0) {
      cy.log('message index = 0');
      cy.get(Locators.MES_DATE)
        .eq(messageIndex)
        .should(
          'have.text',
          `Date: ${dateFormat(
            messageDetails.data.attributes.sentDate,
            'MMMM D, YYYY [at] h:mm a z',
          )}`,
        );
    } else {
      cy.get(Locators.MES_DATE)
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
}

export default new PatientReplyPage();
