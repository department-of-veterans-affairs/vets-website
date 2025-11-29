import userWithAppeals from '../../fixtures/mocks/user-with-appeals.json';
import {
  mockBaseEndpoints,
  setShowDocumentUploadStatus,
} from '../../support/helpers';

describe('STEM claim cards', () => {
  const setupStemCardsTest = (stemClaims = []) => {
    cy.intercept('GET', '/v0/education_benefits_claims/stem_claim_status', {
      data: stemClaims,
    });
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  const createEvidenceSubmission = ({
    id = 123,
    acknowledgementDate,
    failedDate = '2022-02-01T12:00:00.000Z',
  }) => ({
    id,
    claimId: '1234', // Not used by UI
    uploadStatus: 'FAILED',
    acknowledgementDate,
    createdAt: failedDate,
    deleteDate: null,
    documentType: 'STEM Supporting Documents',
    failedDate,
    fileName: 'stem-document.pdf',
    lighthouseUpload: true,
    trackedItemId: null,
    trackedItemDisplayName: null,
    vaNotifyStatus: 'SENT',
  });

  const createStemClaim = ({
    id = '1234',
    automatedDenial = true,
    deniedAt = '2022-01-31T15:08:20.489Z',
    submittedAt = '2022-01-31T15:08:20.489Z',
    evidenceSubmissions = [],
  }) => {
    // Commented out properties are part of the STEM claims response but not currently used by the card UI
    return {
      id,
      type: 'education_benefits_claims',
      attributes: {
        confirmationNumber: `V-EBC-${id}`,
        // isEnrolledStem,
        // isPursuingTeachingCert,
        // benefitLeft,
        // remainingEntitlement,
        automatedDenial, // Determines if card displays
        deniedAt, // "Last updated on..." text
        submittedAt, // "Received on..." text
        evidenceSubmissions, // For upload error alerts
      },
    };
  };

  beforeEach(() => {
    mockBaseEndpoints({
      features: [setShowDocumentUploadStatus(true)],
    });

    cy.intercept('GET', '/v0/benefits_claims', {
      data: [],
    });
    cy.intercept('GET', '/v0/appeals', {
      data: [],
    });

    cy.login(userWithAppeals);
  });

  it('should display denied STEM claim', () => {
    setupStemCardsTest([createStemClaim({})]);

    cy.findByText('Edith Nourse Rogers STEM Scholarship application');
    cy.findByText('Received on January 31, 2022');

    cy.findByText('Status: Denied');
    cy.findByText('Last updated on: January 31, 2022');
    cy.findByRole('link', {
      name: 'Details for claim submitted on January 31, 2022',
    }).should(
      'have.attr',
      'href',
      '/track-claims/your-stem-claims/1234/status',
    );

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
              acknowledgementDate: '2030-12-31T23:59:59.999Z',
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
