/**
 * Sets up a claim detail page test.
 * Intercepts the claim API endpoint, visits the claim detail page, and injects Axe.
 * @param {Object} options - Configuration options
 * @param {Object} options.claim - Claim data
 * @param {string} options.path - Path to visit (status, files, overview, needed-from-others, needed-from-you)
 * @returns {void}
 */
export const setupClaimTest = ({ claim = {}, path = 'status' } = {}) => {
  cy.intercept('GET', '/v0/benefits_claims/123456789', { data: claim });
  cy.visit(`/track-claims/your-claims/123456789/${path}`);
  cy.injectAxe();
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
 * Sets the feature toggle for showing document upload status.
 * @param {boolean} enabled - Whether the feature toggle is enabled
 * @returns {Object} - The feature toggle object
 */
export const setShowDocumentUploadStatus = enabled => ({
  name: 'cst_show_document_upload_status',
  value: enabled,
});

/**
 * Stubs base endpoints used across all claims-status E2E tests.
 * Prevents real API calls to feature toggles and CMS EHR data.
 *
 * @param {Object} options - Configuration options
 * @param {Array} options.features - Additional feature flags to merge with defaults
 */
export const mockBaseEndpoints = ({ features = [] } = {}) => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: { features: [...DEFAULT_FEATURES, ...features] },
  });
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

/**
 * Asserts page title, breadcrumbs, and heading for claims-status pages.
 * Automatically includes "VA.gov home" as first breadcrumb and "Check your claims and appeals" as second.
 *
 * @param {Object} options - Assertion options
 * @param {string} options.title - Expected document title
 * @param {Object} [options.secondBreadcrumb] - Optional override for second breadcrumb
 * @param {Object} [options.thirdBreadcrumb] - Optional third breadcrumb {name, href}
 * @param {string} options.heading - Expected h1 heading text {name, level}
 */
export const verifyTitleBreadcrumbsHeading = ({
  title,
  secondBreadcrumb = {
    // TODO: Create issue for: Each breadcrumb segment should use the full page title
    name: 'Check your claims and appeals',
    href: '/your-claims',
  },
  thirdBreadcrumb,
  heading,
}) => {
  cy.title().should('eq', title);

  // Build breadcrumbs array, conditionally including third breadcrumb
  const allBreadcrumbs = [
    { name: 'VA.gov home', href: '/' },
    secondBreadcrumb,
    ...(thirdBreadcrumb ? [thirdBreadcrumb] : []),
  ];

  cy.get('va-breadcrumbs')
    .shadow()
    .within(() => {
      allBreadcrumbs.forEach(({ name, href }) => {
        cy.findByRole('link', { name }).should('have.attr', 'href', href);
      });
    });

  cy.findByRole('heading', {
    name: heading.name,
    level: heading.level || 1,
  });
};

/**
 * Verifies the "Need help?" section.
 */
export const verifyNeedHelp = () => {
  cy.get('va-need-help')
    .shadow()
    .findByRole('heading', {
      name: 'Need help?',
    });

  cy.get('va-need-help').within(() => {
    cy.contains('Call the VA benefits hotline at').should('be.visible');
    cy.get('va-telephone[contact="8008271000"]')
      .shadow()
      .should('have.text', '800-827-1000');
    cy.contains(
      "We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET",
    ).should('be.visible');
    cy.get('va-telephone[contact="711"]')
      .shadow()
      .should('have.text', 'TTY: 711');
  });
};
