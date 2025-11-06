class DownloadReportsPage {
  goToReportsPage = () => {
    cy.visit('my-health/medical-records/download');
  };

  goToDownloadAllPage = () => {
    cy.get('[data-testid="go-to-download-all"]').click();
  };

  clickCcdAccordionItem = () => {
    // Wait for web component to be fully hydrated and stable
    cy.get('[data-testid="ccdAccordionItem"]', { timeout: 15000 })
      .should('be.visible')
      .should('have.class', 'hydrated');

    // Click the accordion and wait for expansion
    cy.get('[data-testid="ccdAccordionItem"]').click();

    // Wait for the headline text to appear (confirms accordion expanded)
    cy.contains('Continuity of Care Document', { timeout: 15000 }).should(
      'be.visible',
    );

    // Wait for buttons to be rendered and stable
    cy.get('[data-testid^="generateCcdButton"]', { timeout: 15000 }).should(
      'have.length.greaterThan',
      0,
    );

    // Wait for first button to be fully visible and interactable
    cy.get('[data-testid^="generateCcdButton"]', { timeout: 15000 })
      .first()
      .should('be.visible')
      .should('not.be.disabled');
  };

  clickSelfEnteredAccordionItem = () => {
    cy.get('[data-testid="selfEnteredAccordionItem"]').click();
  };

  verifyCcdDownloadXmlFileButton = () => {
    cy.get('[data-testid="generateCcdButtonXml"]').should('be.visible');
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
      cy.get('[data-testid="generateCcdButtonXml"]').click();
      cy.wait('@ccdGenerateResponse');
      cy.wait('@getXml');
    });
  };

  clickCcdDownloadXmlFileButtonWithoutDownloadIntercept = ccdGenerateResponse => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/ccd/generate',
      ccdGenerateResponse,
    ).as('ccdGenerateResponse');
    cy.get('[data-testid="generateCcdButtonXml"]').click();
    cy.wait('@ccdGenerateResponse');
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

  clickDownloadSelfEnteredButton = selfEnteredResponse => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/self_entered',
      selfEnteredResponse,
    ).as('getSelfEnteredRecords');
    cy.get('[data-testid="downloadSelfEnteredButton"]').click();
  };

  verifySelfEnteredDownloadStartedAlert = () => {
    cy.get('[data-testid="download-success-alert-message"]').should(
      'contain',
      'Self-entered health information report download started',
    );
  };

  clickCcdDownloadXmlButtonV2 = pathToFixture => {
    cy.fixture(pathToFixture, 'utf8').then(xmlBody => {
      cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.xml', {
        statusCode: 200,
        headers: { 'Content-Type': 'application/xml' },
        body: xmlBody,
      }).as('downloadCcdV2Xml');

      cy.get('[data-testid="generateCcdButtonXmlOH"]', { timeout: 15000 })
        .should('be.visible')
        .should('not.be.disabled')
        .click();
      cy.wait('@downloadCcdV2Xml');
    });
  };

  clickCcdDownloadHtmlButtonV2 = pathToFixture => {
    cy.fixture(pathToFixture, 'utf8').then(htmlBody => {
      cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.html', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: htmlBody,
      }).as('downloadCcdV2Html');

      cy.get('[data-testid="generateCcdButtonHtmlOH"]', { timeout: 15000 })
        .should('be.visible')
        .click();
      cy.wait('@downloadCcdV2Html');
    });
  };

  clickCcdDownloadPdfButtonV2 = () => {
    const pdfMock = '%PDF-1.4\n%mock pdf content\n%%EOF';

    cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.pdf', {
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfMock,
    }).as('downloadCcdV2Pdf');

    cy.get('[data-testid="generateCcdButtonPdfOH"]', { timeout: 15000 })
      .should('be.visible')
      .click();
    cy.wait('@downloadCcdV2Pdf');
  };

  verifyDualAccordionVisible = () => {
    cy.contains('h4', 'Your VA Medical Records (Legacy System)', {
      timeout: 15000,
    }).should('be.visible');
    cy.contains('h4', 'Your VA Medical Records (Oracle Health)', {
      timeout: 15000,
    }).should('be.visible');
  };

  verifyVistaDownloadLinksVisible = () => {
    cy.get('[data-testid="generateCcdButtonXmlVista"]', {
      timeout: 15000,
    }).should('be.visible');
    cy.get('[data-testid="generateCcdButtonPdfVista"]', {
      timeout: 15000,
    }).should('be.visible');
    cy.get('[data-testid="generateCcdButtonHtmlVista"]', {
      timeout: 15000,
    }).should('be.visible');
  };

  verifyOHDownloadLinksVisible = () => {
    cy.get('[data-testid="generateCcdButtonXmlOH"]', {
      timeout: 15000,
    }).should('be.visible');
    cy.get('[data-testid="generateCcdButtonPdfOH"]', {
      timeout: 15000,
    }).should('be.visible');
    cy.get('[data-testid="generateCcdButtonHtmlOH"]', {
      timeout: 15000,
    }).should('be.visible');
  };
}
export default new DownloadReportsPage();
