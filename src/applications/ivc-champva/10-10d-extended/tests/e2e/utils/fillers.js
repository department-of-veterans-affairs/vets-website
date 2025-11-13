import { goToNextPage } from './helpers';

export const fillAddressAndGoToNext = (fieldName, fieldData) => {
  cy.fillAddressWebComponentPattern(fieldName, fieldData);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};
