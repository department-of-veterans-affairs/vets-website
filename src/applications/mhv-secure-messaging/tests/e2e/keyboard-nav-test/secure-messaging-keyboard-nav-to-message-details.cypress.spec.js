import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessageWithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

// TODO add before hook to clean-up duplicates
describe('Navigate to Message Details ', () => {
  it('Keyboard Nav Access to Expended Messages', () => {
    const messageDetailsPage = new PatientMessageDetailsPage();
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessageWithAttachment);
    cy.contains('Print').should('be.visible');
    cy.tabToElement('button')
      .eq(0)
      .should('contain', 'Print');
    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_MOVE).should('have.focus');
    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.BUTTON_TRASH)
      .should('be.visible')
      .then(() => {
        cy.get(Locators.BUTTONS.BUTTON_TRASH).should('have.focus');
      });
    messageDetailsPage.realPressForExpandAllButton();
    messageDetailsPage.verifyClickAndExpandAllMessagesHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
  it('Keyboard Navigation to Print Button', () => {
    const messageDetailsPage = new PatientMessageDetailsPage();
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessageWithAttachment);
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
