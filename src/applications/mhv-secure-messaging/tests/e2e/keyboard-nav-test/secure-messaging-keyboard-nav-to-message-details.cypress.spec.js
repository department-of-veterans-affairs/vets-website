import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessageWithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Navigate to Message Details ', () => {
  it('Keyboard Nav Access to Expended Messages', () => {
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    PatientMessageDetailsPage.loadMessageDetails(mockMessageWithAttachment);
    cy.contains('Print').should('be.visible');
    cy.tabToElement('button')
      .eq(0)
      .should('contain', 'Print');
    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_MOVE).should('be.visible');
    cy.realPress('Tab');

    cy.get(Locators.BUTTONS.BUTTON_TRASH)
      .should('be.visible')
      .then(() => {
        cy.get(Locators.BUTTONS.BUTTON_TRASH).should('have.focus');
      });
    PatientMessageDetailsPage.realPressForExpandAllButton();
    PatientMessageDetailsPage.verifyClickAndExpandAllMessagesHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Keyboard Navigation to Print Button', () => {
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    PatientMessageDetailsPage.loadMessageDetails(mockMessageWithAttachment);
    cy.contains('Print').should('be.visible');
    cy.tabToElement('button')
      .eq(0)
      .should('contain', 'Print');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_MOVE).should('be.visible');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_TRASH).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
