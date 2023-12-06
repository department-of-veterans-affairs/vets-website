class PatientInterstitialPage {
  getContinueButton = () => {
    return cy.get('[data-testid="continue-button"]');
  };

  CheckFocusOnVcl = () => {
    cy.get('[text="Connect with the Veterans Crisis Line"]').click();
    cy.get('.va-modal-close').click();
    cy.get('[text="Connect with the Veterans Crisis Line"]').should(
      'have.focus',
    );
  };
}
export default new PatientInterstitialPage();
