import { reviewAndSubmitPageFlow } from '../../../../shared/tests/e2e/helpers';

/**
 * Navigate to the next page by clicking Continue button
 */
export const goToNextPage = pagePath => {
  cy.findByText(/continue/i, { selector: 'button' }).click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

/**
 * Start the form as an authenticated user
 */
export const startAsAuthUser = () => {
  cy.findAllByText(/verify/i, { selector: 'a' })
    .first()
    .click();
  cy.location('pathname').should('include', '/name');
};

/**
 * Complete the review and submit page
 */
export const completeReviewAndSubmit = testData => {
  reviewAndSubmitPageFlow(testData.signature, 'Submit form');
};

/**
 * Inject axe and run accessibility check
 */
export const checkAccessibility = () => {
  cy.injectAxeThenAxeCheck();
};
