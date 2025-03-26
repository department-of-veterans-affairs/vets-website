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
    ccdDownloadResponse,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/ccd/generate',
      ccdGenerateResponse,
    ).as('ccdGenerateResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/ccd/download?2025-03-19T15:39:37.000-0400',
      // '/my_health/v1/medical_records/ccd/download?date=2024-11-20T11:57:07.000-0500', // '/my_health/v1/medical_records/ccd/download**',
      ccdDownloadResponse,
    ).as('ccdDownloadResponse');
    cy.get('[data-testid="generateCcdButton"]').click();
    cy.wait('@ccdGenerateResponse');
    cy.wait('@ccdDownloadResponse');
  };

  // create a function for clicking CCD download XML file button without intercepting the download response
  clickCcdDownloadXmlFileButtonWithoutDownloadIntercept = ccdGenerateResponse => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/ccd/generate',
      ccdGenerateResponse,
    ).as('ccdGenerateResponse');
    cy.get('[data-testid="generateCcdButton"]').click();
    cy.wait('@ccdGenerateResponse');
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
