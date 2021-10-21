import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering a valid address that needs confirmation', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        address: '36310 Coronado Dr',
        city: 'Fremont',
        state: 'CA',
        zipCode: '94536',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('confirm-address');
      addressPage.fillAddressForm(formFields);
      cy.findByTestId('save-edit-button').click({
        force: true,
      });
      addressPage.saveForm();
      addressPage.confirmAddressMessage(formFields);
      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '36310 Coronado Dr')
        .and('contain', 'Fremont, CA 94536');

      cy.focused()
        .invoke('text')
        .should('match', /update saved/i);
    });
  });
});
