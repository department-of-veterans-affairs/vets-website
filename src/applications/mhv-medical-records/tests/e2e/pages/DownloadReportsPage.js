import sessionStatus from '../fixtures/session-status.json';

class DownloadReportsPage {
  handleSession = () => {
    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');
  };

  goToReportsPage = () => {
    cy.visit('my-health/medical-records/download');
  };

  clickCcdAccordionItem = () => {
    cy.get('[data-testid="ccdAccordionItem"]').click();
  };

  verifyCcdDownloadXmlFileButton = () => {
    cy.get('[data-testid="generateCcdButton"]').should('be.visible');
  };
}
export default new DownloadReportsPage();
