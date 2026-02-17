import Timeouts from 'platform/testing/e2e/timeouts';
import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail-open-with-failed-submissions.json';
import { DEBOUNCE_MS } from '../../contexts/Type2FailureAnalyticsContext';

// Constants
const TYPE2_EVENT_NAME = 'claims-upload-failure-type-2';

// Selectors
const SELECTORS = {
  claimListItem: '.claim-list-item',
};
const now = Date.now();
const tomorrow = new Date(now + 25 * 24 * 60 * 60 * 1000).toISOString();
const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
const createFeatureToggle = (enabled = true) => ({
  data: {
    type: 'feature_toggles',
    features: [
      {
        name: 'cst_use_claim_details_v2',
        value: true,
      },
      {
        name: 'cst_show_document_upload_status',
        value: enabled,
      },
    ],
  },
});

/**
 * Purpose: Verify analytics wiring works in real browser with actual navigation.
 * Strategy: Keep tests minimal, deterministic, and focused on integration verification.
 */
describe('Type 2 Failure Analytics', () => {
  context(
    'when the "cst_show_document_upload_status" feature toggle is enabled',
    () => {
      it('should record a single event with the correct count for multiple alerts on the Claims list page', () => {
        const claimsListWithFailures = {
          ...claimsList,
          data: claimsList.data.map((claim, index) => {
            if (index === 0) {
              return {
                ...claim,
                attributes: {
                  ...claim.attributes,
                  evidenceSubmissions:
                    claimDetail.data.attributes.evidenceSubmissions
                      .slice(0, 1)
                      .map(submission => ({
                        ...submission,
                        failedDate: twoDaysAgo,
                        acknowledgementDate: tomorrow,
                        createdAt: twoDaysAgo,
                      })),
                },
              };
            }
            return claim;
          }),
        };
        const claimDetailWithDates = {
          ...claimDetail,
          data: {
            ...claimDetail.data,
            attributes: {
              ...claimDetail.data.attributes,
              evidenceSubmissions:
                claimDetail.data.attributes.evidenceSubmissions.map(
                  submission => ({
                    ...submission,
                    failedDate: twoDaysAgo,
                    acknowledgementDate: tomorrow,
                    createdAt: twoDaysAgo,
                  }),
                ),
            },
          },
        };
        const trackClaimsPage = new TrackClaimsPageV2();

        trackClaimsPage.loadPage(
          claimsListWithFailures,
          claimDetailWithDates,
          false, // submitForm
          false, // cstClaimPhasesToggleEnabled
          createFeatureToggle(true), // customFeatureToggles
        );
        // Wait for page to load
        cy.get(SELECTORS.claimListItem, { timeout: Timeouts.slow }).should(
          'be.visible',
        );
        // Wait for debounce to complete
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(DEBOUNCE_MS + 50);
        // Assert: Exactly one Type 2 event with count of 1 (only one claim with failed submission)
        cy.window()
          .its('dataLayer')
          .then(dl => {
            const type2Events = dl.filter(
              item => item.event === TYPE2_EVENT_NAME,
            );
            expect(type2Events).to.have.length(1);
            expect(type2Events[0]).to.deep.include({
              event: TYPE2_EVENT_NAME,
              'upload-fail-alert-count': 1,
            });
          });

        cy.axeCheck();
      });

      it('should record a single event on Status page', () => {
        const claimDetailWithDates = {
          ...claimDetail,
          data: {
            ...claimDetail.data,
            attributes: {
              ...claimDetail.data.attributes,
              evidenceSubmissions:
                claimDetail.data.attributes.evidenceSubmissions.map(
                  submission => ({
                    ...submission,
                    failedDate: twoDaysAgo,
                    acknowledgementDate: tomorrow,
                    createdAt: twoDaysAgo,
                  }),
                ),
            },
          },
        };

        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailWithDates,
          false, // submitForm
          false, // cstClaimPhasesToggleEnabled
          createFeatureToggle(true), // customFeatureToggles
        );

        // Navigate to claim detail page (uses page object method)
        trackClaimsPage.verifyInProgressClaim(true);
        // Verify the Type 2 alert is visible on the status page
        cy.get('va-alert[status="error"]', { timeout: Timeouts.slow }).should(
          'be.visible',
        );
        // Assert: Type 2 event was fired on status page
        cy.window()
          .its('dataLayer')
          .then(dl => {
            const type2Events = dl.filter(
              item => item.event === TYPE2_EVENT_NAME,
            );
            expect(type2Events).to.have.length(1);
            // The length of the event should be 1 because we are only recording the Type 2 event for the single failed submission
            expect(type2Events[0]).to.deep.include({
              event: TYPE2_EVENT_NAME,
              'upload-fail-alert-count': 1,
            });
          });

        cy.axeCheck();
      });
    },
  );

  context(
    'when the "cst_show_document_upload_status" feature toggle is disabled',
    () => {
      it('should not record any events', () => {
        const claimDetailWithDates = {
          ...claimDetail,
          data: {
            ...claimDetail.data,
            attributes: {
              ...claimDetail.data.attributes,
              evidenceSubmissions:
                claimDetail.data.attributes.evidenceSubmissions.map(
                  submission => ({
                    ...submission,
                    failedDate: twoDaysAgo,
                    acknowledgementDate: tomorrow,
                    createdAt: twoDaysAgo,
                  }),
                ),
            },
          },
        };
        const trackClaimsPage = new TrackClaimsPageV2();

        trackClaimsPage.loadPage(
          claimsList,
          claimDetailWithDates,
          false, // submitForm
          false, // cstClaimPhasesToggleEnabled
          createFeatureToggle(false), // customFeatureToggles
        );

        cy.get(SELECTORS.claimListItem, { timeout: Timeouts.slow }).should(
          'be.visible',
        );

        cy.window()
          .its('dataLayer')
          .then(dl => {
            const type2Events = dl.filter(
              item => item.event === TYPE2_EVENT_NAME,
            );
            expect(type2Events).to.have.length(0);
          });

        cy.axeCheck();
      });
    },
  );
});
