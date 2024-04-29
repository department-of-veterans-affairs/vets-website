/* eslint-disable cypress/unsafe-to-chain-command */
export const acceptPrivacyAgreement = () => {
  cy.get('va-checkbox[name="privacyAgreementAccepted"]')
    .scrollIntoView()
    .shadow()
    .find('label')
    .click();
};

export const goToNextPage = pagePath => {
  // Clicks Continue button, and optionally checks destination path.
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .scrollIntoView()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

// Keyboard-only pattern helpers
export const fillAddressWithKeyboard = (fieldName, value) => {
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

export const fillDateWithKeyboard = (fieldName, value) => {
  const [year, month, day] = value
    .split('-')
    .map(num => parseInt(num, 10).toString());
  cy.tabToElement(`va-memorable-date[name="root_${fieldName}"]`)
    .shadow()
    .find('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .chooseSelectOptionUsingValue(month)
    .realPress('Tab')
    .realType(day)
    .realPress('Tab')
    .realType(year);
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

export const selectDropdownWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.chooseSelectOptionUsingValue(value);
};

export const selectRadioWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.findOption(value);
  cy.realPress('Space');
};
