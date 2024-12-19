import {
  goToNextPage,
  fillTextWebComponent,
  selectYesNoWebComponent,
  selectDropdownWebComponent,
} from '.';

export const advanceToNextOfKin = () => {
  cy.get('[href="#start"]')
    .first()
    .click();

  goToNextPage('/veteran-information/mailing-address');
  selectYesNoWebComponent('view:doesMailingMatchHomeAddress', true);

  goToNextPage('/veteran-information/contact-information');

  goToNextPage('/veteran-information/emergency-contacts-summary');
  selectYesNoWebComponent('view:isEmergencyContactsEnabled', false);

  goToNextPage('/veteran-information/next-of-kin-summary');
};

export const fillContactPersonalInfo = contact => {
  fillTextWebComponent('fullName_first', contact.fullName.first);
  fillTextWebComponent('fullName_last', contact.fullName.last);
  fillTextWebComponent('primaryPhone', contact.primaryPhone);
  selectDropdownWebComponent('relationship', contact.relationship);
  selectYesNoWebComponent('view:hasNextOfKinAddress', true);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};

export const fillContactAddress = contact => {
  selectDropdownWebComponent('address_country', contact.address.country);
  fillTextWebComponent('address_street', contact.address.street);
  fillTextWebComponent('address_city', contact.address.city);
  selectDropdownWebComponent('address_state', contact.address.state);
  fillTextWebComponent('address_postalCode', contact.address.postalCode);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};
