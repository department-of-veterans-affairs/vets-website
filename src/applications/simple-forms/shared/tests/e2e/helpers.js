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

export const selectYesNoWebComponent = (fieldName, value) => {
  const selection = value ? 'Y' : 'N';
  selectRadioWebComponent(fieldName, selection);
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
    // V1 web component
    // cy.get(`va-checkbox[name="root_${fieldName}"]`)
    //   .shadow()
    //   .find('input')
    //   .check();

    // V3 web component - work around for not being able to check input
    cy.get(`va-checkbox[name="root_${fieldName}"]`)
      .shadow()
      .find('label')
      .click();
  }
};

export const selectGroupCheckboxWidget = label => {
  if (label) {
    cy.get(`va-checkbox[label="${label}"]`)
      .shadow()
      .get('#checkbox-element')
      .first()
      .click();
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
  if (addressObject.city) {
    if (addressObject.isMilitary) {
      // there is a select dropdown instead when military is checked
      selectDropdownWebComponent(`${fieldName}_city`, addressObject.city);
    } else {
      fillTextWebComponent(`${fieldName}_city`, addressObject.city);
    }
  }
  selectDropdownWebComponent(`${fieldName}_country`, addressObject.country);
  fillTextWebComponent(`${fieldName}_street`, addressObject.street);
  fillTextWebComponent(`${fieldName}_street2`, addressObject.street2);
  fillTextWebComponent(`${fieldName}_street3`, addressObject.street3);
  selectDropdownWebComponent(`${fieldName}_state`, addressObject.state);
  fillTextWebComponent(`${fieldName}_postalCode`, addressObject.postalCode);
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
