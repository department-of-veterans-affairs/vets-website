// single fields
export const fillTextWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-text-input[name="root_${fieldName}"]`)
      .shadow()
      .find('input')
      .type(value);
  }
};

export const fillTextAreaWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-textarea[name="root_${fieldName}"]`)
      .shadow()
      .find('textarea')
      .type(value);
  }
};

export const selectRadioWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(
      `va-radio-option[name="root_${fieldName}"][value="${value}"]`,
    ).click();
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

export const selectCheckboxWebComponent = (fieldName, condition) => {
  if (condition) {
    cy.get(`va-checkbox[name="root_${fieldName}"]`)
      .shadow()
      .find('input')
      .check();
  }
};

// patterns

export const fillFullNameWebComponentPattern = (fieldName, fullName) => {
  fillTextWebComponent(`${fieldName}_first`, fullName.first);
  fillTextWebComponent(`${fieldName}_middle`, fullName.middle);
  fillTextWebComponent(`${fieldName}_last`, fullName.last);
};

export const fillAddressWebComponentPattern = (fieldName, addressObject) => {
  selectCheckboxWebComponent(
    `${fieldName}_isMilitary`,
    addressObject.isMilitary,
  );
  selectDropdownWebComponent(`${fieldName}_country`, addressObject.country);
  fillTextWebComponent(`${fieldName}_street`, addressObject.street);
  fillTextWebComponent(`${fieldName}_street2`, addressObject.street2);
  fillTextWebComponent(`${fieldName}_street3`, addressObject.street3);
  fillTextWebComponent(`${fieldName}_city`, addressObject.city);
  selectDropdownWebComponent(`${fieldName}_state`, addressObject.state);
  fillTextWebComponent(`${fieldName}_postalCode`, addressObject.postalCode);
};

export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');
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
};

// page test definitions

export const introductionPageFlow = () => {
  cy.findAllByText(/start/i, { selector: 'button' });
  cy.findAllByText(/without signing in/i)
    .first()
    .click({ force: true });
};

export const reviewAndSubmitPageFlow = signerName => {
  cy.get('#veteran-signature')
    .shadow()
    .get('#inputField')
    .type(
      signerName.middle
        ? `${signerName.first} ${signerName.middle} ${signerName.last}`
        : `${signerName.first} ${signerName.last}`,
    );
  cy.get(`input[name="veteran-certify"]`).check();
  cy.findAllByText(/Submit application/i, {
    selector: 'button',
  }).click();
};
