import ccdGenerateError from '../fixtures/ccd-generate-response-error.json';

class DownloadReportsPage {
  goToReportsPage = () => {
    cy.visit('my-health/medical-records/download');
  };

  goToDownloadAllPage = () => {
    cy.get('[data-testid="go-to-download-all"]').click();
  };

  clickCcdAccordionItem = () => {
    cy.get('[data-testid="ccdAccordionItem"]').click();
  };

  clickSelfEnteredAccordionItem = () => {
    cy.get('[data-testid="selfEnteredAccordionItem"]').click();
  };

  verifyCcdDownloadXmlFileButton = () => {
    cy.get('[data-testid="generateCcdButton"]').should('be.visible');
  };

  clickCcdDownloadXmlFileButton = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/ccd/generate',
      ccdGenerateError,
    );
    cy.get('[data-testid="generateCcdButton"]').click();
  };

  verifySelfEnteredDownloadButton = () => {
    cy.get('[data-testid="downloadSelfEnteredButton"]').should('be.visible');
  };
}
export default new DownloadReportsPage();
