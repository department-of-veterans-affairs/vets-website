class MedicalRecordsLandingPage {
  clickExpandAllAccordionButton = () => {
    cy.contains('Expand all').click({ force: true });
  };

  verifyPageTitle = () => {
    cy.get('[data-testid="mr-landing-page-title"]').contains('Medical records');
  };

  verifyDownloadOnMhvLink = linkText => {
    cy.get('[data-testid="go-to-mhv-download-records"]').should('be.visible');
    cy.get('[data-testid="go-to-mhv-download-records"]')
      .contains(linkText)
      .invoke('attr', 'href')
      .should(
        'contain',
        'myhealth.va.gov/mhv-portal-web/download-my-data', // mhv-syst.
      );
  };

  verifyLabsAndTestsLink = () => {
    cy.get('[data-testid="labs-and-tests-landing-page-link"]')
      .should('have.attr', 'href')
      .and('include', '/my-health/medical-records/labs-and-tests');
  };

  verifyNotesLink = () => {
    cy.get('[data-testid="notes-landing-page-link"]')
      .should('have.attr', 'href')
      .and('include', '/my-health/medical-records/summaries-and-notes');
  };

  verifyVaccinesLink = () => {
    cy.get('[data-testid="vaccines-landing-page-link"]')
      .should('have.attr', 'href')
      .and('include', '/my-health/medical-records/vaccines');
  };

  verifyAllergiesLink = () => {
    cy.get('[data-testid="allergies-landing-page-link"]')
      .should('have.attr', 'href')
      .and('include', '/my-health/medical-records/allergies');
  };

  verifyConditionsLink = () => {
    cy.get('[data-testid="conditions-landing-page-link"]')
      .should('have.attr', 'href')
      .and('include', '/my-health/medical-records/conditions');
  };

  verifyVitalsLink = () => {
    cy.get('[data-testid="vitals-landing-page-link"]')
      .should('have.attr', 'href')
      .and('include', '/my-health/medical-records/vitals');
  };
}
export default new MedicalRecordsLandingPage();
