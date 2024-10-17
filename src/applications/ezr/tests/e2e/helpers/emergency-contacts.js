import {
  goToNextPage,
  fillTextWebComponent,
  selectYesNoWebComponent,
  selectDropdownWebComponent,
} from '.';

export const advanceToEmergencyContacts = () => {
  cy.get('[href="#start"]')
    .first()
    .click();

  goToNextPage('/veteran-information/mailing-address');
  selectYesNoWebComponent('view:doesMailingMatchHomeAddress', true);

  goToNextPage('/veteran-information/contact-information');
  cy.tabToContinueForm();
};

export const fillEmergencyContactPersonalInfo = contact => {
  fillTextWebComponent('fullName_first', contact.fullName.first);
  fillTextWebComponent('fullName_last', contact.fullName.last);
  fillTextWebComponent('primaryPhone', contact.primaryPhone);
  selectDropdownWebComponent('relationship', contact.relationship);
  selectYesNoWebComponent('view:hasEmergencyContactAddress', true);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};

export const fillEmergencyContactAddress = contact => {
  selectDropdownWebComponent('address_country', contact.address.country);
  fillTextWebComponent('address_street', contact.address.street);
  fillTextWebComponent('address_city', contact.address.city);
  selectDropdownWebComponent('address_state', contact.address.state);
  fillTextWebComponent('address_postalCode', contact.address.postalCode);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};
