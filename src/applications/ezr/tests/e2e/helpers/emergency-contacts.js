import { goToNextPage, selectYesNoWebComponent } from '.';

export const advanceToEmergencyContacts = () => {
  cy.get('[href="#start"]')
    .first()
    .click();

  goToNextPage('/veteran-information/mailing-address');
  selectYesNoWebComponent('view:doesMailingMatchHomeAddress', true);

  goToNextPage('/veteran-information/contact-information');
  cy.tabToContinueForm();
};
