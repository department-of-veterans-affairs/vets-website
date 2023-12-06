import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockAutoSaveDraftResponse from './fixtures/autosafe-draft-response.json';
import { AXE_CONTEXT } from './utils/constants';
import { draftAutoSaveTimeout } from '../../util/constants';
import PatientComposePage from './pages/PatientComposePage';

describe.skip(manifest.appName, () => {
  const composePage = new PatientComposePage();
  describe('Verify draft auto save', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      const landingPage = new PatientInboxPage();

      site.login();
      landingPage.loadInboxMessages();
      landingPage.navigateToComposePage();
      landingPage.composeMessage();
      cy.intercept(
        'POST',
        '/my_health/v1/messaging/message_drafts',
        mockAutoSaveDraftResponse,
      ).as('autoSave');
      cy.intercept(
        'PUT',
        `/my_health/v1/messaging/message_drafts/${
          mockAutoSaveDraftResponse.data.attributes.messageId
        }`,
        mockAutoSaveDraftResponse,
      ).as('autoSaveDetailed');
      cy.wait('@autoSave', { timeout: draftAutoSaveTimeout + 1000 }).then(
        xhr => {
          cy.log(JSON.stringify(xhr.response.body));
          cy.get('[data-testid="message-subject-field"]')
            .shadow()
            .find('#inputField')
            .type('testSubject2');
          cy.wait('@autoSaveDetailed', {
            timeout: draftAutoSaveTimeout + 1000,
          });
        },
      );
    });
    it('verify notification message', () => {
      cy.get('.last-save-time').should('contain', 'Your message was saved');
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
});
