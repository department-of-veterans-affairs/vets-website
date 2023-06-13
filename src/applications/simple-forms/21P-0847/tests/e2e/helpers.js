export const fillTextWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-text-input[name="${fieldName}"]`)
      .shadow()
      .find('input')
      .type(value);
  }
};

export const fillTextAreaWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-textarea[name="${fieldName}"]`)
      .shadow()
      .find('textarea')
      .type(value);
  }
};

export const selectRadioWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-radio-option[name="${fieldName}"][value="${value}"]`).click();
  }
};

export const selectDropdownWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-select[name="${fieldName}"]`)
      .shadow()
      .find('select')
      .select(value);
  }
};

export const conditionallySelectCheckboxWebComponent = (
  fieldName,
  condition,
) => {
  if (condition) {
    cy.get(`va-checkbox[name="${fieldName}"]`)
      .shadow()
      .find('input')
      .check();
  }
};

export const fillDateWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');
    cy.get(`va-memorable-date[name="${fieldName}Month"]`)
      .shadow()
      .find('va-text-input.usa-form-group--month-input')
      .shadow()
      .find('input')
      .type(month)
      .then(() => {
        cy.get(`va-memorable-date[name="${fieldName}Day"]`)
          .shadow()
          .find('va-text-input.usa-form-group--day-input')
          .shadow()
          .find('input')
          .type(day)
          .then(() => {
            cy.get(`va-memorable-date[name="${fieldName}Year"]`)
              .shadow()
              .find('va-text-input.usa-form-group--year-input')
              .shadow()
              .find('input')
              .type(year);
          });
      });
  }
};
