import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT } from '../utils/constants';
import requestBody from '../fixtures/message-compose-request-body.json';

for (let i = 0; i < 20; i += 1) {
  describe('Secure Messaging Keyboard Nav to Attachment', () => {
    it('Keyboard Nav to Focus on Attachment', () => {
      const landingPage = new PatientInboxPage();
      const composePage = new PatientComposePage();
      const site = new SecureMessagingSite();
      site.login();
      landingPage.loadInboxMessages();
      landingPage.navigateToComposePage();
      composePage.selectRecipient(requestBody.recipientId);
      composePage.selectCategory(
        `${requestBody.category}${requestBody.category}input`,
      );
      // cy.tabToElement('#OTHEROTHERinput');
      // cy.realPress(['Enter']);
      composePage
        .getMessageSubjectField()
        .type(`${requestBody.subject}`, { force: true });
      composePage
        .getMessageBodyField()
        .type(`${requestBody.body}`, { force: true });
      composePage.attachMessageFromFile('test_image.jpg');
      composePage.verifyFocusonMessageAttachment();
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
      composePage.sendMessage();
    });
  });
}
