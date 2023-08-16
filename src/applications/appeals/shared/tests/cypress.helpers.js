/**
 * Area of disagreement page Cypress e2e test
 */
export const areaOfDisagreementPageHook = ({ afterHook, index }) => {
  cy.injectAxeThenAxeCheck();
  afterHook(() => {
    cy.get('@testData').then(testData => {
      const { areaOfDisagreement } = testData;
      const { disagreementOptions, otherEntry } = areaOfDisagreement[index];
      Object.entries(disagreementOptions).forEach(([key, value]) => {
        if (value) {
          cy.get(`va-checkbox[name="${key}"]`).click();
        }
      });
      if (otherEntry) {
        cy.get('va-text-input')
          .shadow()
          .find('input')
          .type(otherEntry);
      }
      cy.findByText('Continue', { selector: 'button' }).click();
    });
  });
};
