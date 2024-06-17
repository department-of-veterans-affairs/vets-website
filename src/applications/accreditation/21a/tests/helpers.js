export const selectDropdownWebComponent = (fieldName, value) => {
  cy.selectVaSelect(`root_${fieldName}`, value);
};
<<<<<<< arf-83873-form-21a-step-2

export const selectYesNoWebComponent = (fieldName, value) => {
  cy.selectYesNoVaRadioOption(`root_${fieldName}`, value);
};
=======
>>>>>>> main
