export const selectDropdownWebComponent = (fieldName, value) => {
  cy.selectVaSelect(`root_${fieldName}`, value);
};

export const selectYesNoWebComponent = (fieldName, value) => {
  cy.selectYesNoVaRadioOption(`root_${fieldName}`, value);
};

export const selectCheckboxGroupWebComponent = data => {
  data.forEach(key => {
    cy.get(`va-checkbox[data-key="${key}"]`)
      .shadow()
      .find('label')
      .click();
  });
};
