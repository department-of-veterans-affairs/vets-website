import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import ccdGenerateErrorResponse from './fixtures/ccd-generate-response-error.json';
import vistaOnlyUser from './fixtures/users/vista-only-user.json';
import ohOnlyUser from './fixtures/users/oh-only-user.json';

describe('Medical Records download CCD page - Error Handling', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    site.loadPage();
  });

  it('Verify CCD download error', () => {
    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.verifyCcdDownloadXmlFileButton();

    const generateResponseWithNewDate = DownloadReportsPage.updateDateGenerated(
      ccdGenerateErrorResponse,
    );

    DownloadReportsPage.clickCcdDownloadXmlFileButtonWithoutDownloadIntercept(
      generateResponseWithNewDate,
    );

    DownloadReportsPage.verifyCcdExpiredError();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});

describe('Medical Records download CCD - 24 Hour Retry Timestamp', () => {
  const site = new MedicalRecordsSite();

  describe('CCD retry lockout for VistA users', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
    });

    it('displays access trouble alert when CCD error occurred within 24 hours', () => {
      // Set localStorage to simulate recent CCD error
      const recentError = new Date().toISOString();
      cy.window().then(win => {
        win.localStorage.setItem('lastCCDError', recentError);
      });

      DownloadReportsPage.goToReportsPage();

      // Verify access trouble alert is displayed
      cy.contains(
        "We can't download your continuity of care document right now",
      ).should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('does not display access trouble alert when no CCD error in localStorage', () => {
      // Clear any existing localStorage
      cy.window().then(win => {
        win.localStorage.removeItem('lastCCDError');
      });

      DownloadReportsPage.goToReportsPage();

      // Access trouble alert should not be displayed
      cy.contains(
        "We can't download your continuity of care document right now",
      ).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('does not display access trouble alert when CCD error is older than 24 hours', () => {
      // Set localStorage to simulate old CCD error (more than 24 hours ago)
      const oldError = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      cy.window().then(win => {
        win.localStorage.setItem('lastCCDError', oldError);
      });

      DownloadReportsPage.goToReportsPage();

      // Access trouble alert should not be displayed for expired errors
      cy.contains(
        "We can't download your continuity of care document right now",
      ).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('CCD retry lockout for OH-only users', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
    });

    it('displays access trouble alert when CCD error occurred within 24 hours for OH users', () => {
      // Set localStorage to simulate recent CCD error
      const recentError = new Date().toISOString();
      cy.window().then(win => {
        win.localStorage.setItem('lastCCDError', recentError);
      });

      DownloadReportsPage.goToReportsPage();

      // Verify access trouble alert is displayed for OH users
      cy.contains(
        "We can't download your continuity of care document right now",
      ).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records download CCD - API Error Handling', () => {
  const site = new MedicalRecordsSite();

  describe('CCD generation API error for VistA users', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('handles 500 server error during CCD generation', () => {
      DownloadReportsPage.clickCcdAccordionItem();

      cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('ccdGenerateError');

      cy.get('[data-testid="generateCcdButtonXmlVistA"]').click();
      cy.wait('@ccdGenerateError');

      // The error should be handled gracefully
      cy.injectAxeThenAxeCheck();
    });

    it('handles network timeout during CCD generation', () => {
      DownloadReportsPage.clickCcdAccordionItem();

      cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', {
        forceNetworkError: true,
      });

      cy.get('[data-testid="generateCcdButtonXmlVistA"]').click();

      // The error should be handled gracefully
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('CCD V2 API error for OH-only users', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('handles 500 server error during CCD V2 download', () => {
      cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.xml', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      });

      cy.get('[data-testid="generateCcdButtonXmlOH"]')
        .shadow()
        .find('a')
        .click({ force: true });

      // The error should be handled gracefully
      cy.injectAxeThenAxeCheck();
    });
  });
});
