class MedicalRecordsLandingPage {
  clickExpandAllAccordionButton = () => {
    cy.contains('Expand all').click({ force: true });
  };

  verifyPageTitle = () => {
    cy.get('[data-testid="mr-landing-page-title"]').contains('Medical records');
  };
}
export default new MedicalRecordsLandingPage();
