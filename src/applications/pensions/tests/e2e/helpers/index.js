import { expect } from 'chai';

// navigation helpers
export const goToNextPage = pagePath => {
  // clicks Continue button, and optionally checks destination path.
  cy.clickFormContinue();
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
      .type(value);
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

// pattern fill helpers
export const fillFullNameWebComponentPattern = (
  fieldNamePrefix,
  index,
  fieldName,
  fields,
) => {
  fillTextWebComponent(
    `${fieldNamePrefix}_${index}_${fieldName}_first`,
    fields[fieldName].first,
  );
  if (fields[fieldName].middle) {
    fillTextWebComponent(
      `${fieldNamePrefix}_${index}_${fieldName}_middle`,
      fields[fieldName].middle,
    );
  }
  fillTextWebComponent(
    `${fieldNamePrefix}_${index}_${fieldName}_last`,
    fields[fieldName].last,
  );
  if (fields[fieldName].suffix) {
    selectDropdownWebComponent(
      `${fieldNamePrefix}_${index}_${fieldName}_suffix`,
      fields[fieldName].suffix,
    );
  }
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

// single page array fill helpers
export const fillPreviousNamesPage = (fields, index) => {
  fillFullNameWebComponentPattern(
    'previousNames',
    index,
    'previousFullName',
    fields,
  );
};
export const fillCurrentEmploymentHistoryPage = (fields, index) => {
  fillTextWebComponent(`currentEmployers_${index}_jobType`, fields.jobType);
  fillTextWebComponent(
    `currentEmployers_${index}_jobHoursWeek`,
    fields.jobHoursWeek,
  );
};
export const fillPreviousEmploymentHistoryPage = (fields, index) => {
  fillTextWebComponent(`previousEmployers_${index}_jobType`, fields.jobType);
  fillTextWebComponent(
    `previousEmployers_${index}_jobHoursWeek`,
    fields.jobHoursWeek,
  );
  fillTextWebComponent(`previousEmployers_${index}_jobTitle`, fields.jobTitle);
  if (fields.jobDate) {
    fillDateWebComponentPattern(
      `previousEmployers_${index}_jobDate`,
      fields.jobDate,
    );
  }
};
export const fillVaMedicalCentersPage = (fields, index) => {
  fillTextWebComponent(
    `vaMedicalCenters_${index}_medicalCenter`,
    fields.medicalCenter,
  );
};
export const fillFederalMedicalCentersPage = (fields, index) => {
  fillTextWebComponent(
    `federalMedicalCenters_${index}_medicalCenter`,
    fields.medicalCenter,
  );
};
export const fillSpouseMarriagesPage = (fields, index) => {
  fillFullNameWebComponentPattern(
    'spouseMarriages',
    index,
    'spouseFullName',
    fields,
  );
  selectRadioWebComponent(
    `spouseMarriages_${index}_reasonForSeparation`,
    fields.reasonForSeparation,
  );
  if (fields.otherExplanation) {
    fillTextWebComponent(
      `spouseMarriages_${index}_otherExplanation`,
      fields.otherExplanation,
    );
  }
  fillDateWebComponentPattern(
    `spouseMarriages_${index}_dateOfMarriage`,
    fields.dateOfMarriage,
  );
  fillDateWebComponentPattern(
    `spouseMarriages_${index}_dateOfSeparation`,
    fields.dateOfSeparation,
  );
  fillTextWebComponent(
    `spouseMarriages_${index}_locationOfMarriage`,
    fields.locationOfMarriage,
  );
  fillTextWebComponent(
    `spouseMarriages_${index}_locationOfSeparation`,
    fields.locationOfSeparation,
  );
};
export const fillDependentsPage = (fields, index) => {
  fillFullNameWebComponentPattern('dependents', index, 'fullName', fields);
  fillDateWebComponentPattern(
    `dependents_${index}_childDateOfBirth`,
    fields.childDateOfBirth,
  );
};
export const fillIncomeSourcesPage = (fields, index) => {
  selectRadioWebComponent(
    `incomeSources_${index}_typeOfIncome`,
    fields.typeOfIncome,
  );
  if (fields.otherTypeExplanation) {
    fillTextWebComponent(
      `incomeSources_${index}_otherTypeExplanation`,
      fields.otherTypeExplanation,
    );
  }
  selectRadioWebComponent(`incomeSources_${index}_receiver`, fields.receiver);
  if (fields.dependentName) {
    fillTextWebComponent(
      `incomeSources_${index}_dependentName`,
      fields.dependentName,
    );
  }
  fillTextWebComponent(`incomeSources_${index}_payer`, fields.payer);
  cy.get(`input[name="root_incomeSources_${index}_amount"]`).type(
    fields.amount,
  );
};
export const fillCareExpensesPage = (fields, index) => {
  selectRadioWebComponent(
    `careExpenses_${index}_recipients`,
    fields.recipients,
  );
  if (fields.childName) {
    fillTextWebComponent(`careExpenses_${index}_childName`, fields.childName);
  }
  fillTextWebComponent(`careExpenses_${index}_provider`, fields.provider);
  selectRadioWebComponent(`careExpenses_${index}_careType`, fields.careType);
  if (fields.ratePerHour) {
    cy.get(`input[name="root_careExpenses_${index}_ratePerHour"]`).type(
      fields.ratePerHour,
    );
  }
  if (fields.hoursPerWeek) {
    fillTextWebComponent(
      `careExpenses_${index}_hoursPerWeek`,
      fields.hoursPerWeek,
    );
  }
  if (fields.careDateRange) {
    fillDateWebComponentPattern(
      `careExpenses_${index}_careDateRange_from`,
      fields.careDateRange.from,
    );
    if (fields.careDateRange.to) {
      fillDateWebComponentPattern(
        `careExpenses_${index}_careDateRange_to`,
        fields.careDateRange.to,
      );
    }
  }
  if (fields.noCareEndDate) {
    selectCheckboxWebComponent(
      `careExpenses_${index}_noCareEndDate`,
      fields.noCareEndDate,
    );
  }
  selectRadioWebComponent(
    `careExpenses_${index}_paymentFrequency`,
    fields.paymentFrequency,
  );
  cy.get(`input[name="root_careExpenses_${index}_paymentAmount"]`).type(
    fields.paymentAmount,
  );
};
export const fillMedicalExpensesPage = (fields, index) => {
  selectRadioWebComponent(
    `medicalExpenses_${index}_recipients`,
    fields.recipients,
  );
  if (fields.childName) {
    fillTextWebComponent(
      `medicalExpenses_${index}_childName`,
      fields.childName,
    );
  }
  fillTextWebComponent(`medicalExpenses_${index}_provider`, fields.provider);
  fillTextWebComponent(`medicalExpenses_${index}_purpose`, fields.purpose);
  fillDateWebComponentPattern(
    `medicalExpenses_${index}_paymentDate`,
    fields.paymentDate,
  );
  selectRadioWebComponent(
    `medicalExpenses_${index}_paymentFrequency`,
    fields.paymentFrequency,
  );
  cy.get(`input[name="root_medicalExpenses_${index}_paymentAmount"]`).type(
    fields.paymentAmount,
  );
};

// uses a workaround to check each validation error element,
// instead of using `should('be.empty') on the list of nonempty validation errors,
// because this method causes Cypress to print the specific validation error when failing
export const shouldNotHaveValidationErrors = () => {
  // searches for validation errors on the page
  cy.get('[error]:not(:empty), [role="alert"]:not(:empty)')
    // prevents an error being thrown when no items are found
    .should(Cypress._.noop)
    // throws an error if the validation item has content
    .then($els =>
      // eslint-disable-next-line no-unused-expressions
      $els.each(i => expect($els[i]).to.be.empty),
    );
};

export const shouldHaveVaTextInputError = (fieldName, expectedError) => {
  cy.get(`va-text-input[name="${fieldName}"]`)
    .shadow()
    .find('.usa-error-message')
    .should('contain.text', expectedError);
};
