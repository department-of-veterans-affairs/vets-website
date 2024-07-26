// navigation helpers
export const goToNextPage = pagePath => {
  // clicks Continue button, and optionally checks destination path.
  cy.findAllByText(/continue/i, { selector: 'button' }).click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

// single field fill helpers
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
export const fillAddressWebComponentPattern = (fieldName, { state }) => {
  cy.fillPage();
  selectDropdownWebComponent(`${fieldName}_state`, state);
};

export const fillStatementOfTruthPattern = (label, signature) => {
  cy.findByTestId(label)
    .find('.signature-input')
    .shadow()
    .find('input')
    .first()
    .type(signature);

  cy.findByTestId(label)
    .find('.signature-checkbox')
    .shadow()
    .find('label')
    .click();
};
