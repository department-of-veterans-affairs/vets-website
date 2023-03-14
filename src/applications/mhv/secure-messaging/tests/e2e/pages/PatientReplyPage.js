import { expect } from 'chai';
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
    cy.wait('@replyMessage');
  };

  saveReplyDraft = (
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
      `/my_health/v1/messaging/message_drafts/${messageId}/replydraft`,
      mockMessage,
    ).as('replyDraftMessage');
    cy.get('[data-testid="Save-Draft-Button"]').click();
    cy.wait('@replyDraftMessage').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });

    // cy.log("request boydy = "+JSON.stringify(cy.get('@replyDraftMessage').its('request.body')));
    cy.get('@replyDraftMessage')
      .its('request.body')
      .then(message => {
        cy.log(JSON.stringify(message));
        expect(message.recipientId).to.eq(testRecipientId);
        expect(message.category).to.eq(testCategory);
        expect(message.subject).to.eq(testSubject);
        expect(message.body).to.eq(testBody);
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
      `/my_health/v1/messaging/messages/7179970/reply`,
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
        expect(message.body).to.eq(testBody);
      });
  };

  ReplyDraftData = (
    messageId,
    testRecipientId,
    testCategory,
    testSubject,
    testBody,
  ) => {
    cy.log(`messageId = ${messageId}`);
    cy.log(`messageSubjectParameter = ${testSubject}`);
    cy.log(
      `messageSubjectMockMessage = ${mockMessage.data.attributes.subject}`,
    );
    expect(mockMessage.data.attributes.category).to.eq(testCategory);
    expect(mockMessage.data.attributes.body).to.eq(testBody);
    expect(mockMessage.data.attributes.subject).to.eq(testSubject);
    expect(mockMessage.data.attributes.recipientId).to.eq(testRecipientId);
  };

  verifyReplyDraftData = () => {
    cy.get('@replyDraftMessage')
      .its('request.body')
      .then(message => {
        expect(message.recipientId).to.eq(20029);
        expect(message.subject).to.eq('Medication-Inquiry');
        expect(message.body).to.eq('Test message body');
      });
    cy.get('@replyDraftMessage')
      .its('response.body')
      .then(message => {
        expect(message.data.attributes.messageId).to.eq(7179970);
        expect(message.data.attributes.recipientName).to.eq('ECSTEN, THOMAS ');
        expect(message.data.attributes.body).to.eq('Test message body');
      });
  };

  verifyReplyPageBodyField = () => {
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .should('be.visible');
  };
}

export default PatientReplyPage;
