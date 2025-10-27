/**
 * Check a11y on the page and click the continue button.
 */
export const checkAxeAndClickContinueButton = () => {
  cy.injectAxeThenAxeCheck();
  cy.clickFormContinue();
};
