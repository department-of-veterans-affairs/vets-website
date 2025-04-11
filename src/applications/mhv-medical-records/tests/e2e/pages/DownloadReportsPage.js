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

  clickCcdDownloadXmlFileButton = (
    ccdGenerateResponse,
    pathToCcdDownloadResponse,
  ) => {
    cy.fixture(pathToCcdDownloadResponse, 'utf8').then(xmlBody => {
      cy.intercept(
        'GET',
        '/my_health/v1/medical_records/ccd/generate',
        ccdGenerateResponse,
      ).as('ccdGenerateResponse');
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/d**', {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
        body: xmlBody,
      }).as('getXml');
      cy.get('[data-testid="generateCcdButton"]').click();
      cy.wait('@ccdGenerateResponse');
      cy.wait('@getXml');
    });
  };

  verifyCcdDownloadStartedAlert = () => {
    cy.get('[data-testid="alert-download-started"]')
      .should('be.focused')
      .and('contain', 'Continuity of Care Document download started');
  };

  verifySelfEnteredDownloadButton = () => {
    cy.get('[data-testid="downloadSelfEnteredButton"]').should('be.visible');
  };

  updateDateGenerated = arr => {
    const newDate = new Date();
    return arr.map(item => {
      const newDateGenerated = new Date(newDate);
      newDateGenerated.setDate(newDate.getDate());
      return {
        ...item,
        dateGenerated: newDateGenerated.toISOString(),
      };
    });
  };

  verifyCcdExpiredError = () => {
    cy.get('[data-testid="expired-alert-message"]')
      .should('be.visible')
      .and(
        'contain',
        "We can't download your continuity of care document right now",
      );
  };

  // verifyCcdDownloadStartedError = () => {
}
export default new DownloadReportsPage();
