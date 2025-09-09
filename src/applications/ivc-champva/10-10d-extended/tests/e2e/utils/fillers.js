import { goToNextPage } from './helpers';

export const fillAddressAndGoToNext = (fieldName, fieldData) => {
  cy.fillAddressWebComponentPattern(fieldName, fieldData);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};

export const selectSharedAddressAndGoToNext = value => {
  cy.selectVaSelect('shared-address-select', value);
  cy.injectAxeThenAxeCheck();
  goToNextPage();
};
