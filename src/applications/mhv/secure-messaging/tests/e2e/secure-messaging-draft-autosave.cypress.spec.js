import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockAutoSaveDraftResponse from './fixtures/autosafe-draft-response.json';
import { AXE_CONTEXT } from './utils/constants';
import { draftAutoSaveTimeout } from '../../util/constants';

describe(manifest.appName, () => {
  describe('Advanced search in Drafts', () => {
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
      cy.wait('@autoSave', { timeout: draftAutoSaveTimeout }).then(xhr => {
        cy.log(JSON.stringify(xhr.response.body));
        cy.get('[data-testid="message-subject-field"]')
          .shadow()
          .find('#inputField')
          .type('testSubject2');
        cy.wait('@autoSaveDetailed', { timeout: draftAutoSaveTimeout });
      });
    });
    it('Check all draft messages contain the searched category', () => {
      cy.get('.last-save-time').should('contain', 'Your message was saved');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
});
