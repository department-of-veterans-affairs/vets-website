import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import ccdGenerateResponse from './fixtures/ccd-generate-response.json';
// import ccdDownloadResponse from './fixtures/ccd-download-response.xml';

describe('Medical Records download page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    site.loadPage();
  });

  it('Verifies CCD download', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    const pathToCcdDownloadResponse =
      './applications/mhv-demo-mode/demo-apps/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

    DownloadReportsPage.clickCcdDownloadXmlFileButton(
      ccdGenerateResponse,
      pathToCcdDownloadResponse,
    );

    DownloadReportsPage.verifyCcdDownloadStartedAlert();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('Non-Cerner user sees V2 extended format accordion (not dual)', () => {
    site.mockFeatureToggles({
      isCcdExtendedFileTypesEnabled: true,
    });

    DownloadReportsPage.goToReportsPage();
    DownloadReportsPage.clickCcdAccordionItem();

    cy.get('[data-testid="generateCcdButtonXml"]').should('be.visible');
    cy.get('[data-testid="generateCcdButtonPdf"]').should('be.visible');
    cy.get('[data-testid="generateCcdButtonHtml"]').should('be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
