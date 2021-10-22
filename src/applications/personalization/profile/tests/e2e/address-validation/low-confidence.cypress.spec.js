import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when getting a single suggestion with a confidence score <90', () => {
    it('should show the validation view and successfully update', () => {
      const formFields = {
        address: '36320 Coronado Dr',
        city: 'Fremont',
        state: 'CA',
        zipCode: '94530',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('low-confidence');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(formFields, true, null, [
        'Fremont, CA 94536',
      ]);
      // addressPage.confirmAddress(formFields);

      cy.findByTestId('mailingAddress')
        .should('contain', '36320 Coronado Dr')
        .should('contain', 'Fremont, CA 94530')
        .should('contain', '36320 Coronado Dr')
        .should('contain', 'Fremont, CA 94536')
        .and('contain', 'Please confirm your address');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '36320 Coronado Dr')
        .and('contain', 'Fremont, CA 94536');

      cy.focused()
        .invoke('text')
        .should('match', /update saved/i);
    });
  });
});
