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
}
export default new MedicalRecordsLandingPage();
