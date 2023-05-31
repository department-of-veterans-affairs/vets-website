import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessageWithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';

describe('Navigate to Message Details ', () => {
  it('Keyboard Navigation to Print Button', () => {
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    PatientMessageDetailsPage.loadMessageDetails(mockMessageWithAttachment);

    cy.tabToElement('[class="usa-button-secondary"]').should(
      'contain',
      'Print',
    );
    cy.tabToElement('[class="usa-button-secondary"]').should(
      'contain',
      'Trash',
    );
    cy.tabToElement('[class="usa-button-secondary"]').should('contain', 'Move');
    cy.injectAxe();
    cy.axeCheck();
  });
});
