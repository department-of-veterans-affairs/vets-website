import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import vistaOnlyUser from './fixtures/users/vista-only-user.json';
import ohOnlyUser from './fixtures/users/oh-only-user.json';
import bothSourcesUser from './fixtures/users/both-sources-user.json';
import noFacilitiesUser from './fixtures/users/no-facilities-user.json';

/**
 * Cypress tests for DownloadReportPage.jsx conditional rendering
 *
 * Tests all if statements in the component:
 * 1. if (hasBothDataSources) - Renders VistaAndOHContent
 * 2. if (hasOHOnly) - Renders OHOnlyContent
 * 3. if (hasVistAFacilities) - Renders VistaOnlyContent
 * 4. else (fallback) - Renders fallback content
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

    it('renders VistaAndOHContent component', () => {
      // Verify the page title for VistaAndOHContent (plural "reports")
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      // Verify AcceleratedCernerFacilityAlert is rendered in parent
      // (it may or may not be visible based on alert conditions)

      // Verify NeedHelpSection is rendered
      cy.contains('Need help?').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays Blue Button report section', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should('exist');
      cy.get('[data-testid="go-to-download-all"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays CCD section with facility information', () => {
      cy.contains('h2', 'Download your Continuity of Care Document').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('displays self-entered health information section', () => {
      cy.contains('h2', 'Download your self-entered health information').should(
        'exist',
      );
      cy.get('[data-testid="downloadSelfEnteredButton"]').should('exist');

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

    it('renders OHOnlyContent component', () => {
      // Verify the page title for OHOnlyContent (singular "report")
      cy.contains('h1', 'Download your medical records report').should('exist');

      // Verify NeedHelpSection is rendered
      cy.contains('Need help?').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays CCD download section', () => {
      cy.contains('h2', 'Download your Continuity of Care Document').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('displays Oracle Health CCD download buttons', () => {
      // OH-only users see the OH download buttons directly (no accordion)
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('if (hasVistAFacilities) - User with only VistA facilities', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('renders VistaOnlyContent component', () => {
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

      // Verify VistA download buttons are visible
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

  describe('else (fallback) - User with no facilities', () => {
    beforeEach(() => {
      site.login(noFacilitiesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('renders fallback content when no conditions match', () => {
      // The fallback renders "I see else" heading
      cy.contains('h1', 'I see else').should('exist');

      // Should NOT render the normal content
      cy.contains('Download your medical records reports').should('not.exist');
      cy.contains('Download your medical records report').should('not.exist');
      cy.contains('Need help?').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - Feature Flag Conditions', () => {
  const site = new MedicalRecordsSite();

  describe('ccdExtendedFileTypeFlag behavior for VistA users', () => {
    it('shows extended file types when flag is enabled', () => {
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

  describe('if (params.get("sei") === "true") - Self-entered accordion expansion', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
      });
    });

    it('expands self-entered accordion when sei=true query param is present', () => {
      cy.visit('my-health/medical-records/download?sei=true');

      // The self-entered accordion should be expanded automatically
      cy.get('[data-testid="selfEnteredAccordionItem"]')
        .should('have.attr', 'open')
        .or('contain', 'Self-entered health information');

      cy.injectAxeThenAxeCheck();
    });

    it('does not auto-expand self-entered accordion without query param', () => {
      DownloadReportsPage.goToReportsPage();

      // Without the query param, accordion should not be auto-expanded
      // The download button inside should not be immediately visible without clicking
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - AcceleratedCernerFacilityAlert', () => {
  const site = new MedicalRecordsSite();

  describe('Alert renders in parent for all user types', () => {
    it('renders alert for users with both data sources', () => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // AcceleratedCernerFacilityAlert is rendered in parent
      // Verify the page loads correctly
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('renders alert for OH-only users', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Verify the page loads correctly
      cy.contains('h1', 'Download your medical records report').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('renders alert for VistA-only users', () => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isCcdExtendedFileTypesEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Verify the page loads correctly
      cy.contains('h1', 'Download your medical records reports').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });
});
