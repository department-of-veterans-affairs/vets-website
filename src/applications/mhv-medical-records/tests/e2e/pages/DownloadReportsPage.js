class DownloadReportsPage {
  goToReportsPage = () => {
    cy.visit('my-health/medical-records/download');
  };

  goToDownloadAllPage = () => {
    cy.get('[data-testid="go-to-download-all"]').click();
  };

  clickCcdAccordionItem = () => {
    // Use shadow DOM to access internal button - pattern from Travel Pay and Platform expandAccordions
    // This avoids web component lifecycle issues by clicking the actual button inside the shadow DOM
    // Using { force: true } because the button can be covered by the headline element in the shadow DOM
    cy.get('[data-testid="ccdAccordionItem"]', { timeout: 15000 })
      .shadow()
      .find('button[aria-controls="content"]')
      .click({ force: true, waitForAnimations: true });

    // Verify accordion opened successfully
    cy.contains('Continuity of Care Document', { timeout: 10000 }).should(
      'be.visible',
    );
  };

  clickSelfEnteredAccordionItem = () => {
    cy.get('[data-testid="selfEnteredAccordionItem"]').click();
  };

  verifyCcdDownloadXmlFileButton = () => {
    cy.get('[data-testid="generateCcdButtonXmlVistA"]').should('be.visible');
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
      // Use shadow DOM to access the anchor inside the va-link web component
      cy.get('[data-testid="generateCcdButtonXmlVistA"]')
        .shadow()
        .find('a')
        .click({ force: true });
      cy.wait('@ccdGenerateResponse');
      cy.wait('@getXml');
    });
  };

  clickCcdDownloadXmlFileButtonWithoutDownloadIntercept =
    ccdGenerateResponse => {
      cy.intercept(
        'GET',
        '/my_health/v1/medical_records/ccd/generate',
        ccdGenerateResponse,
      ).as('ccdGenerateResponse');
      // Use shadow DOM to access the anchor inside the va-link web component
      cy.get('[data-testid="generateCcdButtonXmlVistA"]')
        .shadow()
        .find('a')
        .click({ force: true });
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

      // Use shadow DOM to access the link inside the web component
      // Using { force: true } to bypass visibility checks - web component links can have 0x0 dimensions during hydration
      cy.get('[data-testid="generateCcdButtonXmlOH"]', { timeout: 15000 })
        .shadow()
        .find('a')
        .click({ force: true });

      cy.wait('@downloadCcdV2Xml', { timeout: 15000 });
    });
  };

  clickCcdDownloadHtmlButtonV2 = pathToFixture => {
    cy.fixture(pathToFixture, 'utf8').then(htmlBody => {
      cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.html', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: htmlBody,
      }).as('downloadCcdV2Html');

      // Use shadow DOM to access the link inside the web component
      // Using { force: true } to bypass visibility checks - web component links can have 0x0 dimensions during hydration
      cy.get('[data-testid="generateCcdButtonHtmlOH"]', { timeout: 15000 })
        .shadow()
        .find('a')
        .click({ force: true });

      cy.wait('@downloadCcdV2Html', { timeout: 15000 });
    });
  };

  clickCcdDownloadPdfButtonV2 = () => {
    const pdfMock = '%PDF-1.4\n%mock pdf content\n%%EOF';

    cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.pdf', {
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfMock,
    }).as('downloadCcdV2Pdf');

    // Use shadow DOM to access the link inside the web component
    // Using { force: true } to bypass visibility checks - web component links can have 0x0 dimensions during hydration
    cy.get('[data-testid="generateCcdButtonPdfOH"]', { timeout: 15000 })
      .shadow()
      .find('a')
      .click({ force: true });

    cy.wait('@downloadCcdV2Pdf', { timeout: 15000 });
  };

  verifyDualAccordionVisible = () => {
    // Verify both VistA and OH download sections exist by checking for their download buttons
    // Using .should('exist') instead of .should('be.visible') because web components can have 0x0 dimensions
    cy.get('[data-testid="generateCcdButtonXmlVistA"]', {
      timeout: 15000,
    }).should('exist');
    cy.get('[data-testid="generateCcdButtonXmlOH"]', {
      timeout: 15000,
    }).should('exist');

    // Verify facility-specific headings are present for dual CCD (hybrid users only)
    // These are bold <p> tags, not semantic headings
    cy.contains('p', 'Download your CCD for these facilities', {
      timeout: 10000,
    }).should('exist');
  };

  verifyVistaDownloadLinksVisible = () => {
    // Using .should('exist') instead of .should('be.visible') because web components can have 0x0 dimensions
    cy.get('[data-testid="generateCcdButtonXmlVistA"]', {
      timeout: 15000,
    }).should('exist');
    cy.get('[data-testid="generateCcdButtonPdfVistA"]', {
      timeout: 15000,
    }).should('exist');
    cy.get('[data-testid="generateCcdButtonHtmlVistA"]', {
      timeout: 15000,
    }).should('exist');
  };

  verifyOHDownloadLinksVisible = () => {
    // Using .should('exist') instead of .should('be.visible') because web components can have 0x0 dimensions
    cy.get('[data-testid="generateCcdButtonXmlOH"]', {
      timeout: 15000,
    }).should('exist');
    cy.get('[data-testid="generateCcdButtonPdfOH"]', {
      timeout: 15000,
    }).should('exist');
    cy.get('[data-testid="generateCcdButtonHtmlOH"]', {
      timeout: 15000,
    }).should('exist');
  };

  clickCcdDownloadXmlButtonVista = pathToFixture => {
    cy.fixture(pathToFixture, 'utf8').then(xmlBody => {
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', {
        statusCode: 200,
        body: { status: 'OK' },
      }).as('ccdGenerateResponse');
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/d**', {
        statusCode: 200,
        headers: { 'Content-Type': 'application/xml' },
        body: xmlBody,
      }).as('downloadCcdVistaXml');

      cy.get('[data-testid="generateCcdButtonXmlVistA"]', { timeout: 15000 })
        .shadow()
        .find('a')
        .click({ force: true });

      cy.wait('@ccdGenerateResponse', { timeout: 15000 });
      cy.wait('@downloadCcdVistaXml', { timeout: 15000 });
    });
  };

  clickCcdDownloadPdfButtonVista = () => {
    const pdfMock = '%PDF-1.4\n%mock pdf content\n%%EOF';

    cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', {
      statusCode: 200,
      body: { status: 'OK' },
    }).as('ccdGenerateResponse');
    cy.intercept('GET', '/my_health/v1/medical_records/ccd/d**.pdf', {
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfMock,
    }).as('downloadCcdVistaPdf');

    cy.get('[data-testid="generateCcdButtonPdfVistA"]', { timeout: 15000 })
      .shadow()
      .find('a')
      .click({ force: true });

    cy.wait('@ccdGenerateResponse', { timeout: 15000 });
    cy.wait('@downloadCcdVistaPdf', { timeout: 15000 });
  };

  clickCcdDownloadHtmlButtonVista = pathToFixture => {
    cy.fixture(pathToFixture, 'utf8').then(htmlBody => {
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', {
        statusCode: 200,
        body: { status: 'OK' },
      }).as('ccdGenerateResponse');
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/d**.html', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: htmlBody,
      }).as('downloadCcdVistaHtml');

      cy.get('[data-testid="generateCcdButtonHtmlVistA"]', { timeout: 15000 })
        .shadow()
        .find('a')
        .click({ force: true });

      cy.wait('@ccdGenerateResponse', { timeout: 15000 });
      cy.wait('@downloadCcdVistaHtml', { timeout: 15000 });
    });
  };
}
export default new DownloadReportsPage();
