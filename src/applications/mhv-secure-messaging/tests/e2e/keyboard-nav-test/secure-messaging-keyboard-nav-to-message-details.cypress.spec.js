import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessageWithAttachment from '../fixtures/message-response-withattachments.json';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

for (let i = 0; i < 1; i += 1) {
  describe('Navigate to Message Details ', () => {
    it('keyboard navigation to expand messages', () => {
      SecureMessagingSite.login();
      mockMessageWithAttachment.data.id = '7192838';
      mockMessageWithAttachment.data.attributes.attachment = true;
      mockMessageWithAttachment.data.attributes.body = 'attachment';
      PatientInboxPage.loadInboxMessages(
        mockMessages,
        mockMessageWithAttachment,
      );
      PatientMessageDetailsPage.loadMessageDetails(mockMessageWithAttachment);

      // TODO verify each message in thread could be expanded by keyboard
      // PatientMessageDetailsPage.realPressForExpandAllButton();
      // PatientMessageDetailsPage.verifyClickAndExpandAllMessagesHasFocus();

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('keyboard navigation to main buttons', () => {
      SecureMessagingSite.login();
      mockMessageWithAttachment.data.id = '7192838';
      mockMessageWithAttachment.data.attributes.attachment = true;
      mockMessageWithAttachment.data.attributes.body = 'attachment';
      PatientInboxPage.loadInboxMessages(
        mockMessages,
        mockMessageWithAttachment,
      );
      PatientMessageDetailsPage.loadMessageDetails(mockMessageWithAttachment);

      cy.tabToElement('button')
        .eq(0)
        .should('contain', 'Print')
        .and('have.focus');

      cy.realPress('Tab');
      cy.get(Locators.BUTTONS.BUTTON_MOVE).should('have.focus');

      cy.realPress('Tab');
      cy.get(Locators.BUTTONS.BUTTON_TRASH).should('have.focus');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
}
