import { expect } from 'chai';
import { dateFormat } from '../../../util/helpers';
import mockMessage from '../fixtures/message-response.json';

class PatientReplyPage {
  sendReplyMessage = messageId => {
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/messages/${messageId}/reply`,
      mockMessage,
    ).as('replyMessage');
    cy.get('[data-testid="Send-Button"]').click();
    cy.wait('@replyMessage');
  };

  sendReplyMessageDetails = mockReplyMessage => {
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/messages/${
        mockMessage.data.attributes.messageId
      }/reply`,
      mockReplyMessage,
    ).as('replyMessage');
    cy.get('[data-testid="Send-Button"]').click();
    // cy.wait('@replyMessage');
  };

  saveReplyDraft = (repliedToMessage, replyMessageBody) => {
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
    cy.get('[data-testid="Save-Draft-Button"]').click({
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

  sendReplyDraft = (
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
      `/my_health/v1/messaging/messages/${
        mockMessage.data.attributes.messageId
      }/reply`,
      mockMessage,
    ).as('replyDraftMessage');

    cy.get('[data-testid="Send-Button"]').click();
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
      .get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="reply-message-body"]');
  };

  verifySendMessageConfirmationMessageText = () => {
    cy.get('va-alert').should(
      'have.text',
      'Secure message was successfully sent.',
    );
  };

  verifySendMessageConfirmationHasFocus = () => {
    cy.get('va-alert').should('have.focus');
  };

  verifyExpandedMessageDateDisplay = (messageDetails, messageIndex = 0) => {
    cy.log(`messageIndex = ${messageIndex}`);
    if (messageIndex === 0) {
      cy.log('message index = 0');
      cy.get('[data-testid="message-date"]')
        .eq(messageIndex)
        .should(
          'have.text',
          `Date: ${dateFormat(
            messageDetails.data.attributes.sentDate,
            'MMMM D, YYYY [at] h:mm a z',
          )}`,
        );
    } else {
      cy.get('[data-testid="message-date"]')
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

  verifyModalMessageDisplayAndBuddontsCantSaveDraft = () => {
    cy.get('[data-testid="reply-form"]')
      .find('h1')
      .should('have.text', "We can't save this message yet");

    cy.contains('Continue editing').should('be.visible');
    cy.contains('Delete draft').should('be.visible');
  };

  verifyContnueButtonMessageDisplay = () => {
    cy.get('[data-testid="reply-form"]')
      .find('va-button')
      .should('have.attr', 'text', 'Continue editing');
  };

  verifyDeleteButtonMessageDisplay = () => {
    cy.get('[data-testid="reply-form"]')
      .find('va-button[secondary]')
      .should('have.attr', 'text', 'Delete draft');
  };
}

export default new PatientReplyPage();
