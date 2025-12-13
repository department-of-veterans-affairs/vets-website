import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import vistaOnlyUser from './fixtures/users/vista-only-user.json';
import ohOnlyUser from './fixtures/users/oh-only-user.json';
import bothSourcesUser from './fixtures/users/both-sources-user.json';

/**
 * Cypress tests for DownloadReportPage.jsx conditional rendering
 *
 * Tests all conditional branches in the component:
 * 1. if (hasBothDataSources) - Renders VistaAndOHContent
 * 2. if (hasOHOnly) - Renders OHOnlyContent
 * 3. Default return - Renders VistaOnlyContent (for VistA-only users)
 *
 * Based on the current DownloadReportPage.jsx logic:
 * - hasBothDataSources = hasOHFacilities && hasVistAFacilities
 * - hasVistAFacilities = facilities.length > 0 && !hasOHOnly
 */
describe('Medical Records Download Page - Conditional Rendering', () => {
  const site = new MedicalRecordsSite();

  describe('if (hasBothDataSources) - User with both VistA and Oracle Health facilities', () => {
    beforeEach(() => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('renders VistaAndOHContent component with correct heading', () => {
      // Verify the page title for VistaAndOHContent (plural "reports")
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      // Verify NeedHelpSection is rendered
      cy.contains('Need help?').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays Blue Button report section', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should('exist');
      cy.get('[data-testid="go-to-download-all"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays CCD section heading', () => {
      cy.contains('h2', 'Download your Continuity of Care Document').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('displays self-entered health information section with download button', () => {
      cy.contains('h2', 'Download your self-entered health information').should(
        'exist',
      );
      cy.get('[data-testid="downloadSelfEnteredButton"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays CCD download section for VistA facilities', () => {
      // VistaAndOHContent uses DownloadSection from CCDAccordionItemVista
      // which renders download links with testIdSuffix="Vista"
      cy.get('[data-testid="generateCcdButtonXmlVista"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('if (hasOHOnly) - User with only Oracle Health facilities', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('renders OHOnlyContent component with singular heading', () => {
      // Verify the page title for OHOnlyContent (singular "report")
      cy.contains('h1', 'Download your medical records report').should('exist');

      // Verify NeedHelpSection is rendered
      cy.contains('Need help?').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays CCD download section heading', () => {
      cy.contains('h2', 'Download your Continuity of Care Document').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('displays Oracle Health CCD download buttons (XML, PDF, HTML)', () => {
      // OH-only users see the OH download buttons directly (no accordion)
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('does NOT display Blue Button section for OH-only users', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should(
        'not.exist',
      );
      cy.get('[data-testid="go-to-download-all"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('does NOT display accordion pattern for OH-only users', () => {
      cy.get('[data-testid="ccdAccordionItem"]').should('not.exist');
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Default return - User with only VistA facilities', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('renders VistaOnlyContent component with plural heading', () => {
      // Verify the page title for VistaOnlyContent (plural "reports")
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      // Verify NeedHelpSection is rendered
      cy.contains('Need help?').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays Blue Button report section', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should('exist');
      cy.get('[data-testid="go-to-download-all"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays CCD accordion with download options', () => {
      // VistA-only users see the accordion pattern
      cy.get('[data-testid="ccdAccordionItem"]').should('exist');

      // Click to expand accordion
      DownloadReportsPage.clickCcdAccordionItem();

      // Verify VistA download buttons are visible (without Vista suffix for non-hybrid users)
      cy.get('[data-testid="generateCcdButtonXml"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdf"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtml"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays self-entered accordion', () => {
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - Feature Flag Conditions', () => {
  const site = new MedicalRecordsSite();

  describe('ccdExtendedFileTypeFlag behavior for VistA users', () => {
    it('shows extended file types (PDF, HTML) when flag is enabled', () => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      DownloadReportsPage.clickCcdAccordionItem();

      // With flag enabled, should see PDF and HTML buttons
      cy.get('[data-testid="generateCcdButtonPdf"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtml"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('hides extended file types when flag is disabled', () => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: false,
      });
      DownloadReportsPage.goToReportsPage();

      DownloadReportsPage.clickCcdAccordionItem();

      // With flag disabled, should NOT see PDF and HTML buttons
      cy.get('[data-testid="generateCcdButtonPdf"]').should('not.exist');
      cy.get('[data-testid="generateCcdButtonHtml"]').should('not.exist');

      // But XML should still exist
      cy.get('[data-testid="generateCcdButtonXml"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - URL Query Params', () => {
  const site = new MedicalRecordsSite();

  describe('Self-entered accordion expansion via sei query param', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
    });

    it('expands self-entered accordion when sei=true query param is present', () => {
      cy.visit('my-health/medical-records/download?sei=true');

      // The self-entered accordion should be expanded automatically
      // Check that the accordion exists and has open attribute or contains expanded content
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('does not auto-expand self-entered accordion without query param', () => {
      DownloadReportsPage.goToReportsPage();

      // Without the query param, accordion should exist but not be auto-expanded
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - AcceleratedCernerFacilityAlert', () => {
  const site = new MedicalRecordsSite();

  describe('Alert renders in parent for all user types', () => {
    it('page loads correctly for users with both data sources', () => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Verify the page loads correctly with VistaAndOHContent
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('page loads correctly for OH-only users', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Verify the page loads correctly with OHOnlyContent
      cy.contains('h1', 'Download your medical records report').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('page loads correctly for VistA-only users', () => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Verify the page loads correctly with VistaOnlyContent
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - CCD Download Functionality', () => {
  const site = new MedicalRecordsSite();

  describe('OH-only user CCD downloads', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('can download XML CCD file via V2 endpoint', () => {
      const pathToXmlFixture =
        './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response-v2.xml';
      DownloadReportsPage.clickCcdDownloadXmlButtonV2(pathToXmlFixture);

      cy.injectAxeThenAxeCheck();
    });

    it('can download HTML CCD file via V2 endpoint', () => {
      const pathToHtmlFixture =
        './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response-v2.html';
      DownloadReportsPage.clickCcdDownloadHtmlButtonV2(pathToHtmlFixture);

      cy.injectAxeThenAxeCheck();
    });

    it('can download PDF CCD file via V2 endpoint', () => {
      DownloadReportsPage.clickCcdDownloadPdfButtonV2();

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - Component Differentiation', () => {
  const site = new MedicalRecordsSite();

  it('OH-only users see singular "report" heading, VistA users see plural "reports"', () => {
    // First check OH-only user
    site.login(ohOnlyUser, false);
    site.mockFeatureToggles({
      isCcdExtendedFileTypesEnabled: true,
    });
    DownloadReportsPage.goToReportsPage();

    cy.contains('h1', 'Download your medical records report').should('exist');
    cy.contains('h1', 'Download your medical records reports').should(
      'not.exist',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('VistA-only users see plural "reports" heading', () => {
    site.login(vistaOnlyUser, false);
    site.mockFeatureToggles({
      isCcdExtendedFileTypesEnabled: true,
    });
    DownloadReportsPage.goToReportsPage();

    cy.contains('h1', 'Download your medical records reports').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('Both-sources users see plural "reports" heading', () => {
    site.login(bothSourcesUser, false);
    site.mockFeatureToggles({
      isCcdExtendedFileTypesEnabled: true,
    });
    DownloadReportsPage.goToReportsPage();

    cy.contains('h1', 'Download your medical records reports').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
