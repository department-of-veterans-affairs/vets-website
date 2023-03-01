import PatientInboxPage from '../pages/PatientInboxPage';

import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';

describe('Navigate to Message Details ', () => {
  it('Keyboard Navigation to Print Button', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage(false);
    cy.injectAxe();
    cy.axeCheck();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';

    landingPage.loadMessagewithAttachments(mockMessagewithAttachment);
    cy.contains('General:').click({ waitforanimations: true });

    cy.tabToElement('[class="usa-button-secondary"]').should(
      'contain',
      'Print',
    );
    cy.tabToElement('[class="usa-button-secondary"]').should(
      'contain',
      'Trash',
    );
    cy.tabToElement('[class="usa-button-secondary"]').should('contain', 'Move');
  });
});
