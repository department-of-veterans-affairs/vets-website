import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';

describe('Navigate to Message Details ', () => {
  it('Keyboard Navigation to Print Button', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessagewithAttachment);

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
