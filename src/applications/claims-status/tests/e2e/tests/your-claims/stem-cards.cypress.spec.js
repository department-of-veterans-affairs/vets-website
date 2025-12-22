import { createEvidenceSubmission } from '../../support/fixtures/benefitsClaims';
import { createStemClaim } from '../../support/fixtures/stemClaims';
import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';

describe('STEM claim cards', () => {
  const setupStemCardsTest = (stemClaims = []) => {
    mockStemEndpoint(stemClaims);
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  beforeEach(() => {
    mockFeatureToggles({ showDocumentUploadStatus: true });
    mockClaimsEndpoint();
    mockAppealsEndpoint();

    cy.login();
  });

  it('should display denied STEM claim', () => {
    setupStemCardsTest([createStemClaim({})]);

    cy.findByText('Edith Nourse Rogers STEM Scholarship application');
    cy.findByText('Received on January 1, 2025');

    cy.findByText('Status: Denied');
    cy.findByText('Last updated on: January 15, 2025');
    cy.get(
      'va-link[aria-label="Details for claim submitted on January 1, 2025"]',
    ).should('have.attr', 'href', '/track-claims/your-stem-claims/1234/status');

    cy.axeCheck();
  });

  it('should not display non-denied STEM claim', () => {
    setupStemCardsTest([createStemClaim({ automatedDenial: false })]);

    cy.findByText('Edith Nourse Rogers STEM Scholarship application').should(
      'not.exist',
    );

    cy.axeCheck();
  });

  context('when there are upload errors', () => {
    it('should display upload error alert for failed submissions within last 30 days', () => {
      setupStemCardsTest([
        createStemClaim({
          evidenceSubmissions: [
            createEvidenceSubmission({
              uploadStatus: 'FAILED',
              acknowledgementDate: '2050-01-01T00:00:00.000Z',
            }),
          ],
        }),
      ]);

      cy.get('va-alert').findByText(
        'We need you to resubmit files for this claim.',
      );

      cy.axeCheck();
    });

    it('should not display upload error alert for failed submissions older than 30 days', () => {
      setupStemCardsTest([
        createStemClaim({
          evidenceSubmissions: [
            createEvidenceSubmission({
              id: 301,
              acknowledgementDate: '2020-01-01T12:00:00.000Z',
              failedDate: '2019-12-01T12:00:00.000Z',
            }),
          ],
        }),
      ]);

      cy.get('va-alert[status="error"]').should('not.exist');

      cy.axeCheck();
    });
  });
});
