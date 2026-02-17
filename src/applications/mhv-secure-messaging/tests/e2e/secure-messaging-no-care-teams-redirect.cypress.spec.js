import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import mockNoRecipients from './fixtures/recipientsResponse/no-recipients-response.json';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('Secure Messaging - No Care Teams Redirection', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_recent_recipients',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
  });

  describe(' when there are no care teams', () => {
    it('redirects to inbox when accessing Interstitial Page with no care teams', () => {
      PatientInboxPage.loadInboxMessages(
        undefined,
        undefined,
        mockNoRecipients,
      );

      cy.visit('/my-health/secure-messages/new-message');

      cy.location('pathname').should('include', Paths.INBOX);
      PatientInboxPage.validateNoRecipientsAlert();

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
    it('redirects to inbox when accessing Recent Care Teams with no care teams', () => {
      PatientInboxPage.loadInboxMessages(
        undefined,
        undefined,
        mockNoRecipients,
      );

      cy.visit('/my-health/secure-messages/new-message/recent');
      cy.location('pathname').should('include', Paths.INBOX);
      PatientInboxPage.validateNoRecipientsAlert();

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
    it('redirects to inbox when accessing Select Care Teams with no care teams', () => {
      PatientInboxPage.loadInboxMessages(
        undefined,
        undefined,
        mockNoRecipients,
      );

      cy.visit('/my-health/secure-messages/new-message/select-care-team');
      cy.location('pathname').should('include', Paths.INBOX);
      PatientInboxPage.validateNoRecipientsAlert();

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });

  describe('when recipients request returns error', () => {
    beforeEach(() => {
      const mockRecipientsError = {
        statusCode: 500,
        body: {
          errors: [{ code: 'SM999', detail: 'Error fetching recipients' }],
        },
      };

      PatientInboxPage.loadInboxMessages(
        undefined,
        undefined,
        mockRecipientsError,
      );
    });
    it('redirects from Interstitial to inbox when there is an error fetching recipients', () => {
      cy.visit('/my-health/secure-messages/new-message');

      cy.location('pathname').should('include', Paths.INBOX);
      PatientInboxPage.validateRecipientsErrorAlert();
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
    it('redirects from Recent Teams to inbox when there is an error fetching recipients', () => {
      cy.visit('/my-health/secure-messages/new-message/recent');

      cy.location('pathname').should('include', Paths.INBOX);
      PatientInboxPage.validateRecipientsErrorAlert();
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
    it('redirects from Select Care Teams to inbox when there is an error fetching recipients', () => {
      cy.visit('/my-health/secure-messages/new-message/select-care-team');

      cy.location('pathname').should('include', Paths.INBOX);
      PatientInboxPage.validateRecipientsErrorAlert();
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });
});
