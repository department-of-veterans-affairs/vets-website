export const selectCheckboxWebComponent = (fieldName, condition) => {
  cy.selectVaCheckbox(`root_${fieldName}`, condition);
};
