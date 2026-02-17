import { format } from 'date-fns';
import maxTestData from '../fixtures/data/maximal-test.json';

const { data: testData } = maxTestData;

// navigation helpers
export const goToNextPage = (pagePath, isArrayBuilderEditPage = false) => {
  // clicks Continue button, and optionally checks destination path.
  if (isArrayBuilderEditPage) {
    cy.get('va-button[text="continue"]').click();
  } else {
    cy.findAllByText(/continue/i, { selector: 'button' }).click();
  }
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const goToPreviousPage = pagePath => {
  // clicks Back button, and optionally checks destination path.
  cy.findAllByText(/back/i, { selector: 'button' }).click();

  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

// single field fill helpers
export const fillTextWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-text-input[name="root_${fieldName}"]`)
      .shadow()
      .find('input')
      .type(value, { force: true });
  }
};

export const selectCheckboxWebComponent = (fieldName, condition) => {
  if (condition) {
    cy.get(`va-checkbox[name="root_${fieldName}"]`)
      .shadow()
      .find('label')
      .click();
  }
};

export const selectDropdownWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-select[name="root_${fieldName}"]`)
      .shadow()
      .find('select')
      .select(value);
  }
};

export const selectRadioWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(
      `va-radio-option[name="root_${fieldName}"][value="${value}"]`,
    ).click();
  }
};

export const selectYesNoWebComponent = (fieldName, value) => {
  const selection = value ? 'Y' : 'N';
  selectRadioWebComponent(fieldName, selection);
};

export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');

    if (navigator.userAgent.includes('Chrome')) {
      // There is a bug only on Chromium based browsers where
      // VaMemorableDate text input fields will think they are
      // disabled if you blur focus of the window while the test
      // is running. realPress and realType solve this issue,
      // but these are only available for Chromium based browsers.
      // See cypress-real-events npmjs for more info.
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .select(parseInt(month, 10))
        .realPress('Tab')
        .realType(day)
        .realPress('Tab')
        .realType(year);
    } else {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .select(parseInt(month, 10))
        .then(() => {
          cy.get(`va-memorable-date[name="root_${fieldName}"]`)
            .shadow()
            .find('va-text-input.usa-form-group--day-input')
            .shadow()
            .find('input')
            .type(day)
            .then(() => {
              cy.get(`va-memorable-date[name="root_${fieldName}"]`)
                .shadow()
                .find('va-text-input.usa-form-group--year-input')
                .shadow()
                .find('input')
                .type(year);
            });
        });
    }
  }
};

export const fillGulfWarDateRange = () => {
  const { gulfWarStartDate, gulfWarEndDate } =
    testData['view:gulfWarServiceDates'];
  const [startYear, startMonth] = gulfWarStartDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  const [endYear, endMonth] = gulfWarEndDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarStartDateMonth"]').select(
    startMonth,
  );
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarStartDateYear"]').type(
    startYear,
  );
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarEndDateMonth"]').select(
    endMonth,
  );
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarEndDateYear"]').type(
    endYear,
  );
};

export const fillAgentOrangeDateRange = () => {
  const { agentOrangeStartDate, agentOrangeEndDate } =
    testData['view:agentOrangeExposureDates'];
  const [startYear, startMonth] = agentOrangeStartDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  const [endYear, endMonth] = agentOrangeEndDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get(
    '[name="root_view:agentOrangeExposureDates_agentOrangeStartDateMonth"]',
  ).select(startMonth);
  cy.get(
    '[name="root_view:agentOrangeExposureDates_agentOrangeStartDateYear"]',
  ).type(startYear);
  cy.get(
    '[name="root_view:agentOrangeExposureDates_agentOrangeEndDateMonth"]',
  ).select(endMonth);
  cy.get(
    '[name="root_view:agentOrangeExposureDates_agentOrangeEndDateYear"]',
  ).type(endYear);
};

// Keyboard-only pattern helpers
export const fillAddressWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}_country"]`);
  cy.chooseSelectOptionUsingValue(value.country);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street"]`, value.street);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street2"]`, value.street2);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street3"]`, value.street3);
  cy.typeInIfDataExists(`[name="root_${fieldName}_city"]`, value.city);
  cy.tabToElement(`[name="root_${fieldName}_state"]`);
  cy.chooseSelectOptionUsingValue(value.state);
  cy.typeInIfDataExists(
    `[name="root_${fieldName}_postalCode"]`,
    value.postalCode,
  );
};

export const fillNameWithKeyboard = (fieldName, value) => {
  cy.typeInIfDataExists(`[name="root_${fieldName}_first"]`, value.first);
  cy.typeInIfDataExists(`[name="root_${fieldName}_middle"]`, value.middle);
  cy.typeInIfDataExists(`[name="root_${fieldName}_last"]`, value.last);
  if (value.suffix) {
    cy.tabToElement(`[name="root_${fieldName}_suffix"]`);
    cy.chooseSelectOptionUsingValue(value.suffix);
  }
};

export const fillPhoneNumberWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`va-text-input[name="root_${fieldName}"]`)
    .shadow()
    .find('input')
    .realType(value);
};

export const fillDateWithKeyboard = (fieldName, value) => {
  const [year, , day] = value
    .split('-')
    .map(num => parseInt(num, 10).toString());
  const month = format(new Date(value), 'MMM');
  cy.tabToElement(`va-memorable-date[name="root_${fieldName}"]`)
    .shadow()
    .find('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .realType(month)
    .realPress('Tab')
    .realType(day)
    .realPress('Tab')
    .realType(year);
};

export const selectRadioWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.findOption(value);
  cy.realPress('Space');
};

export const selectDropdownWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.chooseSelectOptionUsingValue(value);
};

export const clearVeteranIncome = () => {
  cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').clear();
  cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').clear();
  cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').clear();
};

export const clearSpousalIncome = () => {
  cy.get('[name="root_view:spouseGrossIncome_spouseGrossIncome"]').clear();
  cy.get('[name="root_view:spouseNetIncome_spouseNetIncome"]').clear();
  cy.get('[name="root_view:spouseOtherIncome_spouseOtherIncome"]').clear();
};

export const clearDeductibleExpenses = () => {
  cy.get(
    '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses"',
  ).clear();
  cy.get(
    '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses"',
  ).clear();
  cy.get(
    '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses"',
  ).clear();
};

export const normalizeFeatureFlags = features =>
  features.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});
