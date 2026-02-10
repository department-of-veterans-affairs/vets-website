/**
 * API endpoint URLs used in claims-status E2E tests.
 * Single source of truth for endpoint paths.
 */
export const ENDPOINTS = {
  CLAIMS: '/v0/benefits_claims',
  CLAIM_DETAIL: id => `/v0/benefits_claims/${id}`,
  APPEALS: '/v0/appeals',
  STEM: '/v0/education_benefits_claims/stem_claim_status',
  CLAIM_LETTERS: '/v0/claim_letters',
  CLAIM_LETTER_DOWNLOAD: '/v0/claim_letters/**',
};

/**
 * Default feature flags that are ON in both staging and production.
 * These should be included in all tests to match production behavior.
 */
const DEFAULT_FEATURES = [
  { name: 'claim_letters_access', value: true },
  { name: 'cst_claim_phases', value: true },
  { name: 'cst_include_ddl_5103_letters', value: true },
  { name: 'cst_include_ddl_boa_letters', value: true },
  { name: 'cst_timezone_discrepancy_mitigation', value: true },
  { name: 'stem_automated_decision', value: true },
];

/**
 * Stubs feature toggles for E2E tests.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.showDocumentUploadStatus - Toggle for document upload status feature
 * @param {boolean} options.cstClaimsListFilter - Toggle for claims list filter feature
 */
export const mockFeatureToggles = ({
  showDocumentUploadStatus,
  cstClaimsListFilter,
} = {}) => {
  const features = [...DEFAULT_FEATURES];

  if (showDocumentUploadStatus !== undefined) {
    features.push({
      name: 'cst_show_document_upload_status',
      value: showDocumentUploadStatus,
    });
  }

  if (cstClaimsListFilter !== undefined) {
    features.push({
      name: 'cst_claims_list_filter',
      value: cstClaimsListFilter,
    });
  }

  cy.intercept('GET', '/v0/feature_toggles*', { data: { features } });
  // Always needed to prevent real API calls, but not used by claims-status
  cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
};

/**
 * Stubs the benefits claims endpoint.
 *
 * @param {Array} claims - Array of claim objects to return (default: empty array)
 * @param {number} statusCode - HTTP status code to return (default: 200)
 */
export const mockClaimsEndpoint = (claims = [], statusCode = 200) => {
  cy.intercept('GET', ENDPOINTS.CLAIMS, {
    statusCode,
    body: { data: claims },
  });
};

/**
 * Stubs the appeals endpoint.
 *
 * @param {Array} appeals - Array of appeal objects to return (default: empty array)
 * @param {number} statusCode - HTTP status code to return (default: 200)
 */
export const mockAppealsEndpoint = (appeals = [], statusCode = 200) => {
  cy.intercept('GET', ENDPOINTS.APPEALS, {
    statusCode,
    body: { data: appeals },
  });
};

/**
 * Stubs the STEM claims endpoint.
 *
 * @param {Array} stemClaims - Array of STEM claim objects to return (default: empty array)
 * @param {number} statusCode - HTTP status code to return (default: 200)
 */
export const mockStemEndpoint = (stemClaims = [], statusCode = 200) => {
  cy.intercept('GET', ENDPOINTS.STEM, {
    statusCode,
    body: { data: stemClaims },
  });
};

/**
 * Stubs the claim letters endpoint.
 *
 * @param {Array} letters - Array of claim letter objects to return (default: empty array)
 * @param {number} statusCode - HTTP status code to return (default: 200)
 */
export const mockClaimLettersEndpoint = (letters = [], statusCode = 200) => {
  if (statusCode === 200) {
    cy.intercept('GET', ENDPOINTS.CLAIM_LETTERS, letters).as('claimLetters');
  } else {
    cy.intercept('GET', ENDPOINTS.CLAIM_LETTERS, {
      statusCode,
      body: {
        errors: [
          {
            title: 'Error',
            detail: 'Error',
            code: String(statusCode),
            status: String(statusCode),
          },
        ],
      },
    }).as('claimLetters');
  }
};

/**
 * Stubs the claim letter download endpoint.
 *
 * @param {string} filename - Filename for downloaded file
 */
export const mockClaimLetterDownload = (
  filename = 'ClaimLetter-2022-9-22.txt',
) => {
  cy.intercept('GET', ENDPOINTS.CLAIM_LETTER_DOWNLOAD, {
    statusCode: 200,
    headers: {
      'Content-disposition': `attachment; filename=${filename}`,
    },
    fixture:
      'applications/claims-status/tests/e2e/fixtures/mocks/claim-letters/letter.txt',
  }).as('downloadFile');
};
