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
  cy.fillAddressWebComponentPattern('address', contact.address);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};
