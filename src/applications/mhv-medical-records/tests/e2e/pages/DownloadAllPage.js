import DownloadAllLabsAndTests from '../fixtures/labs-and-tests/downloadAllLabsAndTests.json';
import DownloadAllPatient from '../fixtures/labs-and-tests/downloadAllPatient.json';

class DownloadAllPage {
  verifyBreadcrumbs = breadcrumbs => {
    cy.get('[data-testid="breadcrumbs"]').contains(breadcrumbs, {
      matchCase: false,
    });
  };

  clickBreadcrumbs = breadcrumb => {
    cy.get('[data-testid="breadcrumbs"]')
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
    cy.get('va-select')
      .contains(error)
      .should('be.visible');
  };

  selectDateRangeDropdown = option => {
    cy.get('[data-testid="va-select-date-range"]')
      .find('select')
      .select(option);
  };

  selectCustomStartMonth = month => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('select')
      .eq(0)
      .select(month);
  };

  selectCustomStartDay = day => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('select')
      .eq(1)
      .select(day);
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

  blurCustomStartYear = () => {
    cy.get('[data-testid="va-date-start-date"]')
      .find('input')
      .blur();
  };

  selectCustomEndMonth = month => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('select')
      .eq(0)
      .select(month);
  };

  selectCustomEndDay = day => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('select')
      .eq(1)
      .select(day);
  };

  selectCustomEndYear = year => {
    cy.get('[data-testid="va-date-end-date"]')
      .find('input')
      .type(year);
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

  interceptLabsAndTestsOnDownloadAllPage = () => {
    cy.intercept(
      'GET',
      'my_health/v1/medical_records/labs_and_tests',
      DownloadAllLabsAndTests,
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

  clickDownloadReport = () => {
    cy.get('[data-testid="blue-button-download-report"]').click();
  };

  verifyDownloadStartedAlert = () => {
    cy.get('[data-testid="alert-download-started"]').should('be.visible');
  };
}
export default new DownloadAllPage();
