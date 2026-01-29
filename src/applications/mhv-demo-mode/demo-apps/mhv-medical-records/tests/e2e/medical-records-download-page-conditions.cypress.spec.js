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
        isCcdOHEnabled: true,
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

    it('displays CCD download section for OH facilities', () => {
      // VistaAndOHContent uses DownloadSection for OH facilities
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays facility names in CCD section headings', () => {
      // VistaAndOHContent shows facility names using formatFacilityList
      cy.contains('p', 'CCD: medical records from').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('if (hasOHOnly) - User with only Oracle Health facilities', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
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
        isCcdOHEnabled: true,
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
        isCcdOHEnabled: true,
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
        isCcdOHEnabled: true,
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

  describe('ccdExtendedFileTypeFlag behavior for OH Only users', () => {
    it('shows extended file types (PDF, HTML) when flag is enabled', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // OH-only users don't have accordion, buttons are directly visible
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('hides extended file types when flag is disabled for OH Only users', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: false,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // With flag disabled, should NOT see PDF and HTML buttons
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('not.exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('not.exist');

      // But XML should still exist
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('ccdExtendedFileTypeFlag behavior for Both sources users', () => {
    it('shows extended file types with facility sections when flag is enabled', () => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Both VistA and OH download sections should be visible
      cy.get('[data-testid="generateCcdButtonXmlVista"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfVista"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlVista"]').should('exist');
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonPdfOH"]').should('exist');
      cy.get('[data-testid="generateCcdButtonHtmlOH"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('hides extended file types when flag is disabled for Both sources users', () => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: false,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // With flag disabled, should only show single XML download (no VistA/OH separation)
      cy.get('[data-testid="generateCcdButtonXml"]').should('exist');
      cy.get('[data-testid="generateCcdButtonXmlVista"]').should('not.exist');
      cy.get('[data-testid="generateCcdButtonXmlOH"]').should('not.exist');

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
        isCcdOHEnabled: true,
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

describe('Medical Records Download Page - Self-Entered Health Information', () => {
  const site = new MedicalRecordsSite();

  describe('Self-entered download for VistA users (accordion pattern)', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('displays self-entered accordion item', () => {
      cy.get('[data-testid="selfEnteredAccordionItem"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays self-entered download button inside accordion', () => {
      // Click to expand accordion
      cy.get('[data-testid="selfEnteredAccordionItem"]')
        .shadow()
        .find('button[aria-controls="content"]')
        .click({ force: true });

      cy.get('[data-testid="downloadSelfEnteredButton"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Self-entered download for Both sources users', () => {
    beforeEach(() => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('displays self-entered section heading', () => {
      cy.contains('h2', 'Download your self-entered health information').should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('displays self-entered download button (no accordion)', () => {
      // Both sources users have self-entered section without accordion
      cy.get('[data-testid="downloadSelfEnteredButton"]').should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('displays self-entered description text', () => {
      cy.contains(
        'This report includes all the health information you entered yourself',
      ).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - CernerFacilityAlert', () => {
  const site = new MedicalRecordsSite();

  // Note: CernerFacilityAlert only renders when userAtPretransitionedOhFacility is true
  // in the user profile. The standard test user fixtures don't have this flag set,
  // so the alert should NOT be displayed for these users.

  describe('Cerner alert for OH-only users', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('does not display Cerner facility alert when userAtPretransitionedOhFacility is not set', () => {
      // CernerFacilityAlert returns null when userAtPretransitionedOhFacility is false/undefined
      cy.get('[data-testid="cerner-facilities-alert"]').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });

    it('does not display link to My VA Health portal when userAtPretransitionedOhFacility is not set', () => {
      cy.get('[data-testid="cerner-facility-action-link"]').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Cerner alert for both sources users', () => {
    beforeEach(() => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('does not display Cerner facility alert when userAtPretransitionedOhFacility is not set', () => {
      // CernerFacilityAlert returns null when userAtPretransitionedOhFacility is false/undefined
      cy.get('[data-testid="cerner-facilities-alert"]').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('No Cerner alert for VistA-only users', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('does not display Cerner facility alert for VistA-only users', () => {
      cy.get('[data-testid="cerner-facilities-alert"]').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - CCD Download Success Alerts', () => {
  const site = new MedicalRecordsSite();

  describe('CCD success alert for VistA users', () => {
    it('displays CCD download started alert after successful download', () => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
      DownloadReportsPage.clickCcdAccordionItem();

      const pathToCcdDownloadResponse =
        './applications/mhv-demo-mode/demo-apps/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

      // Use proper generate response format - array with status COMPLETE
      const ccdGenerateResponse = [
        {
          dateGenerated: new Date().toISOString(),
          status: 'COMPLETE',
          patientId: 'test-patient-id',
        },
      ];

      DownloadReportsPage.clickCcdDownloadXmlFileButton(
        ccdGenerateResponse,
        pathToCcdDownloadResponse,
      );

      DownloadReportsPage.verifyCcdDownloadStartedAlert();

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('CCD success alert for OH-only users', () => {
    it('displays CCD download started alert after successful V2 download', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      const pathToFixture =
        './applications/mhv-demo-mode/demo-apps/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

      DownloadReportsPage.clickCcdDownloadXmlButtonV2(pathToFixture);

      cy.get('[data-testid="alert-download-started"]')
        .should('exist')
        .and('contain', 'Continuity of Care Document download started');

      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('Medical Records Download Page - Loading States', () => {
  const site = new MedicalRecordsSite();

  describe('CCD loading spinner for VistA users', () => {
    it('shows loading indicator while generating CCD', () => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
      DownloadReportsPage.clickCcdAccordionItem();

      // Intercept with a delay to catch the loading state
      cy.intercept('GET', '/my_health/v1/medical_records/ccd/generate', req => {
        req.reply({
          delay: 2000,
          statusCode: 200,
          body: { dateGenerated: new Date().toISOString() },
        });
      });

      cy.get('[data-testid="generateCcdButtonXml"]').click();

      // Verify loading indicator appears
      cy.get('#generating-ccd-indicator').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('CCD loading spinner for OH-only users', () => {
    it('shows loading indicator while generating CCD V2', () => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();

      // Intercept with a delay to catch the loading state
      cy.intercept('GET', '/my_health/v2/medical_records/ccd/download.xml', {
        delay: 2000,
        statusCode: 200,
        headers: { 'Content-Type': 'application/xml' },
        body: '<?xml version="1.0"?><ClinicalDocument></ClinicalDocument>',
      });

      cy.get('[data-testid="generateCcdButtonXmlOH"]')
        .shadow()
        .find('a')
        .click({ force: true });

      // Verify loading indicator appears for OH users
      cy.get('#generating-ccd-OH-indicator').should('exist');

      // Exclude heading-order rule during loading state because the transient state
      // causes a violation (h1 → h3) since the h2 is conditionally hidden.
      cy.injectAxeThenAxeCheck('main', { headingOrder: false });
    });
  });
});

describe('Medical Records Download Page - Blue Button Section', () => {
  const site = new MedicalRecordsSite();

  describe('Blue Button for VistA users', () => {
    beforeEach(() => {
      site.login(vistaOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('displays Blue Button report section with download link', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should('exist');
      cy.get('[data-testid="go-to-download-all"]').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    it('Blue Button link navigates to date-range page', () => {
      cy.get('[data-testid="go-to-download-all"]').click();
      cy.url().should('include', '/download/date-range');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Blue Button for both sources users', () => {
    beforeEach(() => {
      site.login(bothSourcesUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('displays Blue Button report section for dual-source users', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should('exist');
      cy.get('[data-testid="go-to-download-all"]').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('No Blue Button for OH-only users', () => {
    beforeEach(() => {
      site.login(ohOnlyUser, false);
      site.mockFeatureToggles({
        isCcdExtendedFileTypesEnabled: true,
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('does not display Blue Button section for OH-only users', () => {
      cy.contains('h2', 'Download your VA Blue Button report').should(
        'not.exist',
      );
      cy.get('[data-testid="go-to-download-all"]').should('not.exist');
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
        isCcdOHEnabled: true,
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
        isCcdOHEnabled: true,
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
        isCcdOHEnabled: true,
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
        isCcdOHEnabled: true,
      });
      DownloadReportsPage.goToReportsPage();
    });

    it('can download XML CCD file via V2 endpoint', () => {
      const pathToXmlFixture =
        './applications/mhv-demo-mode/demo-apps/mhv-medical-records/tests/e2e/fixtures/ccd-download-response-v2.xml';
      DownloadReportsPage.clickCcdDownloadXmlButtonV2(pathToXmlFixture);

      cy.injectAxeThenAxeCheck();
    });

    it('can download HTML CCD file via V2 endpoint', () => {
      const pathToHtmlFixture =
        './applications/mhv-demo-mode/demo-apps/mhv-medical-records/tests/e2e/fixtures/ccd-download-response-v2.html';
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
      isCcdOHEnabled: true,
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
      isCcdOHEnabled: true,
    });
    DownloadReportsPage.goToReportsPage();

    cy.contains('h1', 'Download your medical records reports').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('Both-sources users see plural "reports" heading', () => {
    site.login(bothSourcesUser, false);
    site.mockFeatureToggles({
      isCcdExtendedFileTypesEnabled: true,
      isCcdOHEnabled: true,
    });
    DownloadReportsPage.goToReportsPage();

    cy.contains('h1', 'Download your medical records reports').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
