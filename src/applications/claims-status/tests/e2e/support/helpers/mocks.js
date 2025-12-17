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
 */
export const mockFeatureToggles = ({ showDocumentUploadStatus } = {}) => {
  const features = [...DEFAULT_FEATURES];

  if (showDocumentUploadStatus !== undefined) {
    features.push({
      name: 'cst_show_document_upload_status',
      value: showDocumentUploadStatus,
    });
  }

  cy.intercept('GET', '/v0/feature_toggles*', { data: { features } });
  // Always needed to prevent real API calls, but not used by claims-status
  cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
};

/**
 * Stubs list page endpoints (your-claims page).
 * Prevents real API calls to claims, appeals, and STEM data.
 * All endpoints return empty data arrays by default.
 */
export const mockListPageEndpoints = () => {
  cy.intercept('GET', '/v0/benefits_claims', { data: [] });
  cy.intercept('GET', '/v0/appeals', { data: [] });
  cy.intercept('GET', '/v0/education_benefits_claims/stem_claim_status', {
    data: {},
  });
};
