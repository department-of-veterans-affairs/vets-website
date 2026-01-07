import userWithAppeals from '../../fixtures/mocks/user-with-appeals.json';
import { createAppeal } from '../../support/fixtures/appeals';
import { createEvidenceSubmission } from '../../support/fixtures/benefitsClaims';
import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';

describe('Appeal cards', () => {
  const setupAppealCardsTest = (appeals = []) => {
    mockAppealsEndpoint(appeals);
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  beforeEach(() => {
    mockFeatureToggles();
    mockClaimsEndpoint();
    mockStemEndpoint();

    cy.login(userWithAppeals);
  });

  describe('Appeal types', () => {
    it('should display legacy appeal', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'legacyAppeal',
          eventType: 'nod',
        }),
      ]);

      cy.findByRole('heading', {
        name: 'Disability compensation appeal Received on January 1, 2025',
      });

      cy.findByText(/Issue on appeal/);
      cy.findByText('Tinnitus');
      cy.findByText(/Status:/);
      cy.findByText('Last updated: January 15, 2025');
      cy.get(
        'va-link[aria-label="Details for Disability compensation appeal"]',
      ).should('have.attr', 'href', '/track-claims/appeals/987654321/status');

      cy.axeCheck();
    });

    it('should display supplemental claim', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'supplementalClaim',
          eventType: 'sc_request',
        }),
      ]);

      cy.findByRole('heading', {
        name:
          'Supplemental claim for disability compensation Received on January 1, 2025',
      });

      cy.findByText(/Issue on review/);
      cy.findByText('Tinnitus');
      cy.findByText(/Status:/);
      cy.findByText('Last updated: January 15, 2025');
      cy.get(
        'va-link[aria-label="Details for Supplemental claim for disability compensation"]',
      ).should('have.attr', 'href', '/track-claims/appeals/987654321/status');

      cy.axeCheck();
    });

    it('should display higher-level review', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'higherLevelReview',
          eventType: 'hlr_request',
        }),
      ]);

      cy.findByRole('heading', {
        name:
          'Higher-level review for disability compensation Received on January 1, 2025',
      });

      cy.findByText(/Issue on review/);
      cy.findByText('Tinnitus');
      cy.findByText(/Status:/);
      cy.findByText('Last updated: January 15, 2025');
      cy.get(
        'va-link[aria-label="Details for Higher-level review for disability compensation"]',
      ).should('have.attr', 'href', '/track-claims/appeals/987654321/status');

      cy.axeCheck();
    });

    it('should display appeal (AMA)', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'appeal',
          eventType: 'ama_nod',
        }),
      ]);

      cy.findByRole('heading', {
        name: 'Disability compensation appeal Received on January 1, 2025',
      });

      cy.findByText(/Issue on appeal/);
      cy.findByText('Tinnitus');
      cy.findByText(/Status:/);
      cy.findByText('Last updated: January 15, 2025');
      cy.get(
        'va-link[aria-label="Details for Disability compensation appeal"]',
      ).should('have.attr', 'href', '/track-claims/appeals/987654321/status');

      cy.axeCheck();
    });
  });

  describe('Program areas', () => {
    const programAreas = [
      {
        programArea: 'compensation',
        appealTitle: 'Disability compensation appeal',
        reviewTitle: 'Supplemental claim for disability compensation',
      },
      {
        programArea: 'pension',
        appealTitle: 'Pension appeal',
        reviewTitle: 'Supplemental claim for pension',
      },
      {
        programArea: 'insurance',
        appealTitle: 'Insurance appeal',
        reviewTitle: 'Supplemental claim for insurance',
      },
      {
        programArea: 'loan_guaranty',
        appealTitle: 'Loan guaranty appeal',
        reviewTitle: 'Supplemental claim for loan guaranty',
      },
      {
        programArea: 'education',
        appealTitle: 'Education appeal',
        reviewTitle: 'Supplemental claim for education',
      },
      {
        programArea: 'vre',
        appealTitle: 'Vocational rehabilitation and employment appeal',
        reviewTitle:
          'Supplemental claim for vocational rehabilitation and employment',
      },
      {
        programArea: 'medical',
        appealTitle: 'Health care appeal',
        reviewTitle: 'Supplemental claim for health care',
      },
      {
        programArea: 'burial',
        appealTitle: 'Burial benefits appeal',
        reviewTitle: 'Supplemental claim for burial benefits',
      },
      {
        programArea: 'fiduciary',
        appealTitle: 'Fiduciary appeal',
        reviewTitle: 'Supplemental claim for fiduciary',
      },
    ];

    programAreas.forEach(({ programArea, appealTitle, reviewTitle }) => {
      it(`should display ${appealTitle}`, () => {
        setupAppealCardsTest([
          createAppeal({
            type: 'legacyAppeal',
            eventType: 'nod',
            programArea,
          }),
        ]);

        cy.findByRole('heading', {
          name: `${appealTitle} Received on January 1, 2025`,
        });

        cy.axeCheck();
      });

      it(`should display ${reviewTitle}`, () => {
        setupAppealCardsTest([
          createAppeal({
            type: 'supplementalClaim',
            eventType: 'sc_request',
            programArea,
          }),
        ]);

        cy.findByRole('heading', {
          name: `${reviewTitle} Received on January 1, 2025`,
        });

        cy.axeCheck();
      });
    });
  });

  describe('Issues display', () => {
    it('should display "Issue" for single issue on appeal', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'legacyAppeal',
          eventType: 'nod',
          issuesCount: 1,
        }),
      ]);

      cy.findByText(/Issue on appeal/);
      cy.findByText('Tinnitus');

      cy.axeCheck();
    });

    it('should display "Issues" for multiple issues on appeal', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'legacyAppeal',
          eventType: 'nod',
          issuesCount: 2,
        }),
      ]);

      cy.findByText(/Issues on appeal/);
      cy.findByText('Tinnitus');

      cy.axeCheck();
    });

    it('should display "Issue" for single issue on review', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'supplementalClaim',
          eventType: 'sc_request',
          issuesCount: 1,
        }),
      ]);

      cy.findByText(/Issue on review/);
      cy.findByText('Tinnitus');

      cy.axeCheck();
    });

    it('should display "Issues" for multiple issues on review', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'supplementalClaim',
          eventType: 'sc_request',
          issuesCount: 2,
        }),
      ]);

      cy.findByText(/Issues on review/);
      cy.findByText('Tinnitus');

      cy.axeCheck();
    });
  });

  context('when appeal has no description', () => {
    it('should not display issues section when description is missing', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'legacyAppeal',
          eventType: 'nod',
          description: '',
        }),
      ]);

      cy.findByText('Issues on appeal:').should('not.exist');
      cy.findByText(/Status:/);
      cy.findByText('Last updated: January 15, 2025');

      cy.axeCheck();
    });
  });

  describe('Upload error alerts', () => {
    beforeEach(() => {
      mockFeatureToggles({ showDocumentUploadStatus: true });
      mockClaimsEndpoint();
      mockStemEndpoint();

      cy.login(userWithAppeals);
    });

    it('should display upload error alert for supplemental claim with failed submissions', () => {
      setupAppealCardsTest([
        createAppeal({
          type: 'supplementalClaim',
          eventType: 'sc_request',
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
  });
});
