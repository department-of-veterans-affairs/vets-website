import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import ohOnlyUser from './fixtures/users/oh-only-user.json';

/**
 * Cypress tests for OH-only user experience
 *
 * Tests the Oracle Health-only user experience for the CCD download page,
 * including:
 * - Content rendering (heading, description, download links)
 * - Accessibility compliance
 *
 * Note: OH-only users now render VistaAndOHContent (same as BOTH users)
 * with testIdSuffix="OH" and ddSuffix="OH" for CCD downloads
 */
describe('Medical Records Download Page - OH-Only User Experience', () => {
  const site = new MedicalRecordsSite();

  describe('Content Rendering', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('renders the main heading for OH-only users (plural "reports")', () => {
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );
      cy.injectAxeThenAxeCheck();
    });

    it('renders the intro description text for OH users', () => {
      cy.contains(
        'You can choose which VA medical records to download as a single report',
      ).should('exist');
      cy.injectAxeThenAxeCheck();
    });

    it('renders the CCD section heading', () => {
      cy.contains('h2', 'Download your Continuity of Care Document').should(
        'exist',
      );
      cy.injectAxeThenAxeCheck();
    });

    it('renders the CCD explanation paragraph', () => {
      cy.contains(
        'This Continuity of Care Document (CCD) is a summary of your VA medical records',
      ).should('exist');
      cy.contains('allergies, medications, recent lab results').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    it('renders Need help section', () => {
      cy.contains('Need help?').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Download Links', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('displays all three CCD download links (XML, PDF, HTML)', () => {
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    it('download links have correct Datadog action names', () => {
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should(
        'have.attr',
        'data-dd-action-name',
        'Download CCD XML OH',
      );
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should(
        'have.attr',
        'data-dd-action-name',
        'Download CCD PDF OH',
      );
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should(
        'have.attr',
        'data-dd-action-name',
        'Download CCD HTML OH',
      );
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('has proper heading hierarchy', () => {
      // Verify h1 exists and is first
      cy.get('h1')
        .first()
        .should('contain.text', 'Download your medical records reports');

      // Verify h2 exists for CCD section
      cy.get('h2').should(
        'contain.text',
        'Download your Continuity of Care Document',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('download links are accessible', () => {
      // Verify download links have proper attributes
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should(
        'have.attr',
        'download',
      );
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should(
        'have.attr',
        'download',
      );
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should(
        'have.attr',
        'download',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('passes axe accessibility check on main content', () => {
      cy.injectAxe();
      cy.axeCheck('main');
    });
  });

  describe('OH-Only vs Other User Types', () => {
    it('displays Blue Button report section for OH-only users', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // OH-only users now see Blue Button section
      cy.contains('h2', 'Download your VA Blue Button report').should('exist');
      cy.get('[data-testid="go-to-download-all"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('does not display accordion pattern for OH-only users', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // OH-only users see direct links, not accordions
      cy.get('[data-testid="ccdAccordionItem"]').should('not.exist');
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('uses plural "reports" in heading (same as VistA and Both users)', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // OH-only now has plural heading (same as other user types)
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );
      // Should NOT have singular version
      cy.contains('h1', 'Download your medical records report').should(
        'not.exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - OH-Only User CCD Downloads', () => {
  const site = new MedicalRecordsSite();

  describe('CCD V2 Download Functionality', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('successfully downloads CCD XML file for OH-only user', () => {
      const pathToFixture =
        './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

      DownloadReportsPage.clickCcdDownloadXmlButtonV2(pathToFixture);

      // Verify success alert appears
      cy.get('[data-testid="alert-download-started"]')
        .should('exist')
        .and('contain', 'Continuity of Care Document download started');

      cy.injectAxeThenAxeCheck();
    });

    it('successfully downloads CCD PDF file for OH-only user', () => {
      DownloadReportsPage.clickCcdDownloadPdfButtonV2();

      // Verify success alert appears
      cy.get('[data-testid="alert-download-started"]')
        .should('exist')
        .and('contain', 'Continuity of Care Document download started');

      cy.injectAxeThenAxeCheck();
    });

    it('successfully downloads CCD HTML file for OH-only user', () => {
      const pathToFixture =
        './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

      DownloadReportsPage.clickCcdDownloadHtmlButtonV2(pathToFixture);

      // Verify success alert appears
      cy.get('[data-testid="alert-download-started"]')
        .should('exist')
        .and('contain', 'Continuity of Care Document download started');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('CCD Loading State', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('shows loading indicator while downloading CCD', () => {
      // Intercept with delay to see loading state
      cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.xml', {
        delay: 3000,
        statusCode: 200,
        headers: { 'Content-Type': 'application/xml' },
        body: '<?xml version="1.0"?><ClinicalDocument></ClinicalDocument>',
      });

      cy.get('[data-testid="generateCcdButtonXmlOH"]')
        .shadow()
        .find('a')
        .click({ force: true });

      // Loading indicator should appear
      cy.get('#generating-ccd-OH-indicator').should('exist');

      // Exclude heading-order rule during loading state because the transient state
      // causes a violation (h1 → h3) since the h2 is conditionally hidden.
      cy.injectAxeThenAxeCheck('main', { headingOrder: false });
    });
  });

  describe('Feature Flag Disabled', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: false,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('only shows XML download when extended file types flag is disabled', () => {
      // XML should exist
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');

      // PDF and HTML should NOT exist
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('not.exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
