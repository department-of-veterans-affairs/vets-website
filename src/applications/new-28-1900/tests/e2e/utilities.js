export const fillTextWebComponent = (fieldName, value) => {
  cy.fillVaTextInput(`root_${fieldName}`, value);
};

export const selectDropdownWebComponent = (fieldName, value) => {
  cy.selectVaSelect(`root_${fieldName}`, value);
};

export const selectCheckboxWebComponent = (fieldName, condition) => {
  cy.selectVaCheckbox(`root_${fieldName}`, condition);
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
