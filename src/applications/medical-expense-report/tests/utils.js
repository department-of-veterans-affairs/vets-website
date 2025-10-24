/**
 * Check a11y on the page and click the continue button.
 */
export const checkAxeAndClickContinueButton = () => {
  cy.injectAxeThenAxeCheck();
  cy.clickFormContinue();
};

/** 
 * Check an html element for visibility and content
 */
export const checkVisibleElementContent = (element, content) => {
cy.get(element)
    .should('exist')
    .and('be.visible')
    .contains(content);
}