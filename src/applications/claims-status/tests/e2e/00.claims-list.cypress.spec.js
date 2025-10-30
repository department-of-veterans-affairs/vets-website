import Timeouts from 'platform/testing/e2e/timeouts';
import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimsListWithFailedEvidenceSubmissions from './fixtures/mocks/lighthouse/claims-list-with-failed-evidence-submissions.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

const createUpdatedClaimsList = () => {
  const updatedClaimsList = JSON.parse(
    JSON.stringify(claimsListWithFailedEvidenceSubmissions),
  );
  const now = Date.now();
  const acknowledgementDate = new Date(
    now + 25 * 24 * 60 * 60 * 1000,
  ).toISOString(); // 25 days from now
  const createdAt = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ago
  const failedDate = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ago

  // Update all evidence submissions to avoid date errors
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

describe('Claims List Test', () => {
  it('Tests consolidated claim functionality - C30698', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    cy.expandAccordions();
    cy.axeCheck();
    trackClaimsPage.checkClaimsContent();
  });

  context(
    "when the 'cst_show_document_upload_status' feature toggle is disabled",
    () => {
      it('Does not display the slim alert at all', () => {
        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(createUpdatedClaimsList(), claimDetail);

        cy.get('va-alert').should('not.exist');
        cy.axeCheck();
      });
    },
  );

  context(
    "when the 'cst_show_document_upload_status' feature toggle is enabled",
    () => {
      context(
        'when there are failed evidence submissions within the last 30 days',
        () => {
          it('Displays the slim alert for all three types of claims', () => {
            const trackClaimsPage = new TrackClaimsPage();
            // Mock the feature toggle to enable document upload status
            cy.intercept('GET', '/v0/feature_toggles?*', {
              data: {
                type: 'feature_toggles',
                features: [
                  {
                    name: 'cst_show_document_upload_status',
                    value: true,
                  },
                ],
              },
            }).as('featureToggles');

            trackClaimsPage.loadPage(createUpdatedClaimsList(), claimDetail);

            // Wait for the page to load
            cy.get('.claim-list-item', { timeout: Timeouts.slow }).should(
              'be.visible',
            );
            // Verify we have the expected number of alerts (3 - one for each claim type)
            cy.get('va-alert').should('have.length', 3);
            // 1. Regular claim - "Claim for disability compensation"
            cy.contains('Claim for disability compensation')
              .closest('.claim-list-item')
              .should(
                'contain',
                'We need you to resubmit files for this claim.',
              );
            // 2. STEM claim - "Edith Nourse Rogers STEM Scholarship application"
            cy.contains('Edith Nourse Rogers STEM Scholarship application')
              .closest('.claim-list-item')
              .should(
                'contain',
                'We need you to resubmit files for this claim.',
              );

            // 3. Appeal - "Supplemental Claim"
            cy.contains('Supplemental claim')
              .closest('.claim-list-item')
              .should(
                'contain',
                'We need you to resubmit files for this claim.',
              );
            cy.axeCheck();
          });
        },
      );
    },
  );
});
