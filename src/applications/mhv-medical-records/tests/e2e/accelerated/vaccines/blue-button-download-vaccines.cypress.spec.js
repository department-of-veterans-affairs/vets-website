import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import DownloadReportsPage from '../../pages/DownloadReportsPage';
import DownloadAllPage from '../../pages/DownloadAllPage';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vaccinesData from '../fixtures/vaccines/sample-lighthouse.json';

describe('Medical Records - Blue Button Download with Accelerated Vaccines', () => {
  const site = new MedicalRecordsSite();

  describe('when accelerating vaccines is enabled', () => {
    beforeEach(() => {
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingVaccines: true,
      });
    });

    it('calls v2 immunizations endpoint when downloading vaccines in Blue Button report', () => {
      // Intercept v2 endpoint - this SHOULD be called
      cy.intercept('GET', '/my_health/v2/medical_records/immunizations*', {
        statusCode: 200,
        body: vaccinesData,
      }).as('v2Immunizations');

      // Track v1 endpoint - this should NOT be called
      let v1Called = false;
      cy.intercept('GET', '/my_health/v1/medical_records/vaccines*', req => {
        v1Called = true;
        req.reply({ statusCode: 200, body: vaccinesData });
      }).as('v1Vaccines');

      // Intercept patient endpoint (required for Blue Button)
      cy.intercept('GET', '/my_health/v1/medical_records/patient*', {
        statusCode: 200,
        body: { data: { attributes: {} } },
      }).as('patient');

      site.loadPage();
      DownloadReportsPage.goToReportsPage();
      DownloadReportsPage.goToDownloadAllPage();

      // Select date range
      DownloadAllPage.selectDateRangeDropdown('any');
      DownloadAllPage.clickContinueOnDownloadAllPage();

      // Select vaccines checkbox on page 2
      DownloadAllPage.selectVaccinesCheckbox();
      DownloadAllPage.clickContinueOnDownloadAllPage();

      // Wait for the v2 endpoint to be called
      cy.wait('@v2Immunizations').then(interception => {
        expect(interception.response.statusCode).to.equal(200);
      });

      // Verify v1 was not called
      cy.wrap(null).then(() => {
        expect(v1Called).to.equal(false);
      });

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('when accelerating vaccines is disabled', () => {
    beforeEach(() => {
      site.login();
      // Default feature toggles have acceleration disabled
    });

    it('calls v1 vaccines endpoint when downloading vaccines in Blue Button report', () => {
      // Intercept v1 endpoint - this SHOULD be called
      cy.intercept('GET', '/my_health/v1/medical_records/vaccines*', {
        statusCode: 200,
        body: vaccinesData,
      }).as('v1Vaccines');

      // Track v2 endpoint - this should NOT be called
      let v2Called = false;
      cy.intercept(
        'GET',
        '/my_health/v2/medical_records/immunizations*',
        req => {
          v2Called = true;
          req.reply({ statusCode: 200, body: vaccinesData });
        },
      ).as('v2Immunizations');

      // Intercept patient endpoint (required for Blue Button)
      cy.intercept('GET', '/my_health/v1/medical_records/patient*', {
        statusCode: 200,
        body: { data: { attributes: {} } },
      }).as('patient');

      cy.visit('my-health/medical-records/download');
      DownloadReportsPage.goToDownloadAllPage();

      // Select date range
      DownloadAllPage.selectDateRangeDropdown('any');
      DownloadAllPage.clickContinueOnDownloadAllPage();

      // Select vaccines checkbox on page 2
      DownloadAllPage.selectVaccinesCheckbox();
      DownloadAllPage.clickContinueOnDownloadAllPage();

      // Wait for the v1 endpoint to be called
      cy.wait('@v1Vaccines').then(interception => {
        expect(interception.response.statusCode).to.equal(200);
      });

      // Verify v2 was not called
      cy.wrap(null).then(() => {
        expect(v2Called).to.equal(false);
      });

      cy.injectAxeThenAxeCheck();
    });
  });
});
