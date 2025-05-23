import DownloadAllLabsAndTests from '../fixtures/labs-and-tests/downloadAllLabsAndTests.json';
import DownloadAllVaccines from '../fixtures/labs-and-tests/downloadAllVaccines.json';
import DownloadAllPatient from '../fixtures/labs-and-tests/downloadAllPatient.json';

class DownloadAllPage {
  verifyBreadcrumbs = breadcrumbs => {
    cy.get('[data-testid="mr-breadcrumbs"]').contains(breadcrumbs, {
      matchCase: false,
    });
  };

  clickBreadcrumbs = breadcrumb => {
    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('span')
      .contains(breadcrumb)
      .parent()
      .click();
  };

  clickContinueOnDownloadAllPage = () => {
    // cy.get('va-button:contains("continue")').click();
    cy.get('va-button')
      .contains('Continue')
      .click();
  };

  clickBackOnDownloadAllPage = () => {
    cy.get('va-button')
      .contains('Back')
      .click();
  };

  clickBackOnDownloadAllPage3 = () => {
    cy.get('button')
      .contains('Back')
      .click();
  };

  verifyError = error => {
    cy.get('va-select')
      .contains(error)
      .should('be.visible');
  };

  verifyErrorValidDateRange = error => {
    cy.get('va-select')
      .contains(error)
      .should('be.visible');
  };

  verifyValidStartDateError = error => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('[id^=error-message]')
      .contains(error)
      .should('be.visible');
  };

  verifyValidEndDateError = error => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('[id^=error-message]')
      .contains(error)
      .should('be.visible');
  };

  verifyErrorValidYear = error => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('[id^=error-message]')
      .contains(error)
      .should('be.visible');
  };

  verifyErrorStartDateGreaterThanEnd = error => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('[id^=error-message]')
      .contains(error)
      .should('be.visible');
  };

  verifyDateRangeOnPageTwo = dateRange => {
    cy.get('[data-testid="date-range-legend"]').should('contain', dateRange);
  };

  selectDateRangeDropdown = option => {
    cy.get('[data-testid="va-select-date-range"]')
      .find('select')
      .select(option, { force: true });
  };

  verifyDateRangeDropdown = option => {
    cy.get('[data-testid="va-select-date-range"]')
      .find('select')
      .should('have.value', option);
  };

  selectCustomStartMonth = month => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('select')
      .eq(0)
      .select(month, { force: true });
  };

  selectCustomStartDay = day => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('select')
      .eq(1)
      .select(day, { force: true });
  };

  selectCustomStartYear = year => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('input')
      .type(year);
  };

  clearCustomStartYear = () => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('input')
      .clear();
  };

  clearCustomEndYear = () => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('input')
      .clear();
  };

  verifyCustomStartMonth = month => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('select')
      .eq(0)
      .should('have.value', month);
  };

  verifyCustomStartDay = day => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('select')
      .eq(1)
      .should('have.value', day);
  };

  verifyCustomStartYear = year => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('input')
      .should('have.value', year);
  };

  blurCustomStartYear = () => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('input')
      .blur();
  };

  selectCustomEndMonth = month => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('select')
      .eq(0)
      .select(month, { force: true });
  };

  selectCustomEndDay = day => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('select')
      .eq(1)
      .select(day, { force: true });
  };

  selectCustomEndYear = year => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('input')
      .type(year);
  };

  verifyCustomEndMonth = month => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('select')
      .eq(0)
      .should('have.value', month);
  };

  verifyCustomEndDay = day => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('select')
      .eq(1)
      .should('have.value', day);
  };

  verifyCustomEndYear = year => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('input')
      .should('have.value', year);
  };

  selectAllRecordsCheckbox = () => {
    cy.get('[data-testid="select-all-records-checkbox"]')
      .find('input')
      .check({ force: true });
  };

  selectLabsAndTestsCheckbox = () => {
    cy.get('[data-testid="labs-and-test-results-checkbox"]')
      .find('input')
      .check({ force: true });
  };

  selectVaccinesCheckbox = () => {
    cy.get('[data-testid="vaccines-checkbox"]')
      .find('input')
      .check({ force: true });
  };

  verifyVaccinesCheckboxChecked = () => {
    cy.get('[data-testid="vaccines-checkbox"]')
      .find('input')
      .should('be.checked');
  };

  interceptLabsAndTestsOnDownloadAllPage = () => {
    cy.intercept(
      'GET',
      'my_health/v1/medical_records/labs_and_tests',
      DownloadAllLabsAndTests,
    );
  };

  interceptVaccinesOnDownloadAllPage = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/vaccines',
      DownloadAllVaccines,
    );
  };

  interceptPatientOnDownloadAllPage = () => {
    cy.intercept(
      'GET',
      'my_health/v1/medical_records/patient',
      DownloadAllPatient,
    );
  };

  clickPDFRadioButton = () => {
    cy.get('va-radio-option') // eq(0) because first radio option is PDF option
      .eq(0)
      .find('input')
      .check({ force: true });
  };

  verifyPDFRadioButtonChecked = () => {
    cy.get('va-radio-option')
      .eq(0)
      .find('input')
      .should('be.checked');
  };

  clickDownloadReport = () => {
    cy.get('[data-testid="download-report-button"]').click();
  };

  verifyDownloadStartedAlert = () => {
    cy.get('[data-testid="alert-download-started"]').should('be.visible');
  };
}
export default new DownloadAllPage();
