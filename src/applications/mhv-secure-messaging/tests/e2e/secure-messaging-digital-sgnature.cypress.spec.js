import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Compose', () => {
  const sendMockResponse = {
    data: {
      id: '3685357',
      type: 'messages',
      attributes: {
        messageId: 3685357,
        category: 'OTHER',
        subject: 'DS test',
        body:
          'Abraham Lincoln\nVeteran\nDS test text \n\ndigital signature for ROI request\nDusty Dump',
        attachment: false,
        sentDate: '2024-06-13T20:03:09.000Z',
        senderId: 251391,
        senderName: 'MHVDAYMARK, MARK',
        recipientId: 3658288,
        recipientName: 'Record Amendment Admin',
        readReceipt: null,
        triageGroupName: null,
        proxySenderName: null,
      },
      relationships: {
        attachments: {
          data: [],
        },
      },
      links: {
        self:
          'http://0c8ebb3c8431854ba49998c2805d7217-api.review.vetsgov-internal/my_health/v1/messaging/messages/3685357',
      },
    },
  };
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });
  it('verify user can send a message', () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`);
    PatientComposePage.getMessageBodyField().type(`\nDS tests text`, {
      force: true,
    });

    cy.get('va-card')
      .find('h2')
      .should('have.text', 'Digital signature');

    cy.get('va-card')
      .find('va-text-input')
      .shadow()
      .find('#input-label')
      .should('contain.text', 'Required');

    cy.get('va-card')
      .find('#inputField')
      .type('Dusty Dump', { force: true });

    cy.intercept(
      'POST',
      'http://localhost:3000/my_health/v1/messaging/messages',
      sendMockResponse,
    );

    cy.get('#send-button').click({ force: true });

    PatientComposePage.verifySendMessageConfirmationMessageText();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
