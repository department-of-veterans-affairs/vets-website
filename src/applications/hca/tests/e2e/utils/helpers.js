export const acceptPrivacyAgreement = () => {
  cy.get('va-checkbox[name="privacyAgreementAccepted"]')
    .shadow()
    .find('label')
    .click();
};

export const goToNextPage = pagePath => {
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const startAsAuthUser = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.wait('@mockPrefill');
  cy.location('pathname').should('include', '/check-your-personal-information');
};

export const startAsGuestUser = () => {
  cy.get('.schemaform-start-button')
    .first()
    .click();
  cy.location('pathname').should('include', '/id-form');
};

export const startAsInProgressUser = () => {
  cy.get('[data-testid="continue-your-application"]')
    .first()
    .click();
  cy.wait('@mockPrefill');
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
  cy.tabToElement(`[name="root_${fieldName}Month"]`);
  cy.chooseSelectOptionUsingValue(month);
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(day)) {
    cy.tabToElement(`[name="root_${fieldName}Day"]`);
    cy.chooseSelectOptionUsingValue(day);
  }
  cy.typeInIfDataExists(`[name="root_${fieldName}Year"]`, year);
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
