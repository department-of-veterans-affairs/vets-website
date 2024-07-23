import {
  fillAddressForm,
  loadPage,
  saveForm,
  validateSavedForm,
} from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering an international address', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        country: 'NLD',
        address: 'Dam 1',
        city: 'Amsterdam',
        zipCodeInt: '1012 JS',
      };
      loadPage('international');
      fillAddressForm(formFields);
      saveForm();
      validateSavedForm(formFields, true, null, [
        'Noord-Holland',
        'Netherlands',
      ]);
      cy.injectAxeThenAxeCheck();
    });

    it('should show non-ASCII character validation errors', () => {
      const formFields = {
        country: 'NLD',
        address: 'Dam 1 ابت',
        address2: 'addr 2 †',
        address3: 'addr3 π',
        city: 'Amsterdam 英',
        province: 'province Δ',
        zipCodeInt: '1012 JS ¡',
      };

      loadPage('international');
      fillAddressForm(formFields);
      saveForm();

      cy.get(
        '[error="Our forms can only accept the letters A to Z, numbers 0 to 9, and certain symbols like dashes and periods"]',
      ).then(items => {
        expect(items.length).to.equal(6);
      });

      cy.injectAxeThenAxeCheck();
    });
  });
});
