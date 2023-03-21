import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();
    // const messageDetails = landingPage.setMessageDateToYesterday();
    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    const testMessageBody = 'Test message body';
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type(testMessageBody);

    // recipiendId (should.haveText, recipientId)
    // verify each field separately here. please use parameters of messageDetails to verify

    cy.injectAxe();
    cy.axeCheck();

    replyPage.saveReplyDraft(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );

    cy.get('[data-testid="reply-form"] > :nth-child(3) > :nth-child(1)').should(
      $to => {
        expect($to.text()).to.contain(
          messageDetails.data.attributes.recipientName,
        );
      },
    );
    cy.get('[aria-label="message details."] > :nth-child(1)').should($from => {
      expect($from.text()).to.contain(
        messageDetails.data.attributes.senderName,
      );
    });
    cy.get('[aria-label="message details."] > :nth-child(2)').should($to => {
      expect($to.text()).to.contain(
        messageDetails.data.attributes.recipientName,
      );
    });
    messageDetailsPage.verifyExpandedMessageDateDisplay(messageDetails);

    cy.get('[aria-label="message details."] > :nth-child(4)').should($mID => {
      expect($mID.text()).to.contain(messageDetails.data.attributes.messageId);
    });

    cy.get(
      '.vads-u-margin-top--1 > .message-list-body-collapsed > .vads-u-margin-y--0',
    ).should($mbody => {
      expect($mbody.text()).to.contain(messageDetails.data.attributes.body);
    });
    replyPage.sendReplyDraft(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
