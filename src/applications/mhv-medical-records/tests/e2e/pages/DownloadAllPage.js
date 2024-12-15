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

  clickContinueOnDateSelectionPage = () => {
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
}
export default new DownloadAllPage();
