import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockAutosaveDraftResponse from './fixtures/autosafe-draft-response.json';

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
        mockAutosaveDraftResponse,
      ).as('autoSave');
      cy.wait('@autoSave').then(xhr => {
        cy.log(JSON.stringify(xhr.response.body));
      });
    });
    it('Check all draft messages contain the searched category', () => {
      cy.intercept(
        'PUT',
        `/my_health/v1/messaging/message_drafts/${
          mockAutosaveDraftResponse.data.attributes.messageId
        }`,
        mockAutosaveDraftResponse,
      ).as('autoSaveDetailed');
      cy.wait('@autoSaveDetailed');
      cy.get('.last-save-time').should('contain', 'Your message was saved');
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
});
