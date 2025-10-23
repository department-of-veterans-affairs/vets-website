export const fillTextWebComponent = (fieldName, value) => {
  cy.fillVaTextInput(`root_${fieldName}`, value);
};

export const selectDropdownWebComponent = (fieldName, value) => {
  cy.selectVaSelect(`root_${fieldName}`, value);
};

export const selectCheckboxWebComponent = (fieldName, condition) => {
  cy.selectVaCheckbox(`root_${fieldName}`, condition);
};
