class PatientInterstitialPage {
  getContinueButton = () => {
    return cy.get('[data-testid="continue-button"]');
  };
}
export default new PatientInterstitialPage();
