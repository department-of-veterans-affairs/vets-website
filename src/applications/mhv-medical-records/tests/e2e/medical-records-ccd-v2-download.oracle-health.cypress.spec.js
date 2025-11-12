import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import oracleHealthUser from './accelerated/fixtures/user/oracle-health.json';

describe('Medical Records CCD V2 Download for Oracle Health Patients', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);

    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isCcdExtendedFileTypesEnabled: true,
    });

    DownloadReportsPage.goToReportsPage();
  });

  it('Shows dual CCD accordion for Cerner/Oracle Health patients', () => {
    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.verifyDualAccordionVisible();
    DownloadReportsPage.verifyVistaDownloadLinksVisible();
    DownloadReportsPage.verifyOHDownloadLinksVisible();

    cy.injectAxeThenAxeCheck();
  });

  it('Downloads VistA CCD XML successfully', () => {
    DownloadReportsPage.clickCcdAccordionItem();

    const pathToV1Fixture =
      './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

    cy.fixture(pathToV1Fixture, 'utf8').then(xmlBody => {
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', [
        {
          dateGenerated: '2024-10-30T10:00:00.000Z',
          status: 'COMPLETE',
          patientId: '1013704789V992505',
        },
      ]).as('ccdGenerateResponse');
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/d**', {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
        body: xmlBody,
      }).as('getXml');
      cy.get('[data-testid="generateCcdButtonXmlVista"]', { timeout: 15000 })
        .should('be.visible')
        .click();
      cy.wait('@ccdGenerateResponse');
      cy.wait('@getXml');
    });

    DownloadReportsPage.verifyCcdDownloadStartedAlert();

    cy.injectAxeThenAxeCheck();
  });

  it('Downloads Oracle Health CCD XML successfully', () => {
    DownloadReportsPage.clickCcdAccordionItem();

    const pathToV2Fixture =
      './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response-v2.xml';
    DownloadReportsPage.clickCcdDownloadXmlButtonV2(pathToV2Fixture);

    DownloadReportsPage.verifyCcdDownloadStartedAlert();

    cy.injectAxeThenAxeCheck();
  });

  it('Downloads Oracle Health CCD HTML successfully', () => {
    DownloadReportsPage.clickCcdAccordionItem();

    const pathToHtmlFixture =
      './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response-v2.html';
    DownloadReportsPage.clickCcdDownloadHtmlButtonV2(pathToHtmlFixture);

    DownloadReportsPage.verifyCcdDownloadStartedAlert();

    cy.injectAxeThenAxeCheck();
  });

  it('Downloads Oracle Health CCD PDF successfully', () => {
    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.clickCcdDownloadPdfButtonV2();

    DownloadReportsPage.verifyCcdDownloadStartedAlert();

    cy.injectAxeThenAxeCheck();
  });
});
