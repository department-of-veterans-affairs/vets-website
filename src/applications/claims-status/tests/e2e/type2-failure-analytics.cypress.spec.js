import Timeouts from 'platform/testing/e2e/timeouts';
import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsListWithFailedEvidenceSubmissions from './fixtures/mocks/lighthouse/claims-list-with-failed-evidence-submissions.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';
import { DEBOUNCE_MS } from '../../contexts/Type2FailureAnalyticsContext';

// Constants
const TYPE2_EVENT_NAME = 'claims-upload-failure-type-2';
const ENTRY_POINT_LIST = 'claims-list-page';
const ENTRY_POINT_STATUS = 'claims-status-page';

// Selectors
const SELECTORS = {
  claimListItem: '.claim-list-item',
  claimListItemLink: '.claim-list-item a',
  statusTab: '[data-testid="what-you-need-to-do"]',
};

// Helper: Create claims list with updated dates
const createUpdatedClaimsList = () => {
  const updatedClaimsList = JSON.parse(
    JSON.stringify(claimsListWithFailedEvidenceSubmissions),
  );
  const now = Date.now();
  const acknowledgementDate = new Date(
    now + 25 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const createdAt = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
  const failedDate = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();

  updatedClaimsList.data = updatedClaimsList.data.map(claim => {
    if (claim.attributes.evidenceSubmissions) {
      return {
        ...claim,
        attributes: {
          ...claim.attributes,
          evidenceSubmissions: claim.attributes.evidenceSubmissions.map(
            submission => ({
              ...submission,
              acknowledgementDate,
              createdAt,
              failedDate,
            }),
          ),
        },
      };
    }
    return claim;
  });

  return updatedClaimsList;
};

// Helper: Mock feature toggle
const mockFeatureToggle = (enabled = true) => {
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'cst_show_document_upload_status',
          value: enabled,
        },
      ],
    },
  }).as(enabled ? 'featureToggles' : 'featureTogglesDisabled');
};

/**
 * Purpose: Verify analytics wiring works in real browser with actual navigation.
 * Strategy: Keep tests minimal, deterministic, and focused on integration verification.
 *
 * NOTE: Detailed behavior (debounce, registration, edge cases) is tested in unit tests.
 * These E2E tests only verify the full stack works end-to-end.
 */
describe('Type 2 Failure Analytics', () => {
  context(
    'when the "cst_show_document_upload_status" feature toggle is enabled',
    () => {
      it('Claims list page fires single event with correct count for multiple alerts', () => {
        mockFeatureToggle(true);

        // Install clock BEFORE app loads so we control debounce timers
        cy.clock();

        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(createUpdatedClaimsList(), claimDetail);

        // Wait for feature toggle to be applied
        cy.wait('@featureToggles');

        // Wait for page to load
        cy.get(SELECTORS.claimListItem, { timeout: Timeouts.slow }).should(
          'be.visible',
        );

        // Clear dataLayer after app is mounted
        cy.window().then(win => {
          // eslint-disable-next-line no-param-reassign
          win.dataLayer = [];
        });

        // Advance time past debounce
        cy.tick(DEBOUNCE_MS + 50);

        // Assert: Exactly one event with count of 3
        cy.window()
          .its('dataLayer')
          .should('have.length', 1)
          .then(dl => {
            expect(dl[0]).to.deep.include({
              event: TYPE2_EVENT_NAME,
              count: 3,
              'entry-point': ENTRY_POINT_LIST,
            });
          });

        cy.axeCheck();
      });

      it('Status page fires single record event', () => {
        mockFeatureToggle(true);

        cy.clock();

        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(createUpdatedClaimsList(), claimDetail);

        cy.wait('@featureToggles');

        cy.get(SELECTORS.claimListItem, { timeout: Timeouts.slow }).should(
          'be.visible',
        );

        // Navigate directly to claim detail (skip list page event)
        cy.get(SELECTORS.claimListItemLink)
          .first()
          .click();

        cy.get(SELECTORS.statusTab, { timeout: Timeouts.slow }).should(
          'be.visible',
        );

        // Clear dataLayer after navigation
        cy.window().then(win => {
          // eslint-disable-next-line no-param-reassign
          win.dataLayer = [];
        });

        // Advance time past debounce
        cy.tick(DEBOUNCE_MS + 50);

        // Assert: Exactly one event
        cy.window()
          .its('dataLayer')
          .should('have.length', 1)
          .then(dl => {
            expect(dl[0]).to.deep.include({
              event: TYPE2_EVENT_NAME,
              'entry-point': ENTRY_POINT_STATUS,
            });
            // Should NOT have count property (status page doesn't send it)
            expect(dl[0]).to.not.have.property('count');
          });

        cy.axeCheck();
      });
    },
  );

  context(
    'when the "cst_show_document_upload_status" feature toggle is disabled',
    () => {
      it('should not fire any events', () => {
        mockFeatureToggle(false);

        cy.clock();

        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(createUpdatedClaimsList(), claimDetail);

        cy.wait('@featureTogglesDisabled');

        cy.get(SELECTORS.claimListItem, { timeout: Timeouts.slow }).should(
          'be.visible',
        );

        cy.window().then(win => {
          // eslint-disable-next-line no-param-reassign
          win.dataLayer = [];
        });

        cy.tick(DEBOUNCE_MS + 50);

        // Assert: No Type 2 events fired
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
