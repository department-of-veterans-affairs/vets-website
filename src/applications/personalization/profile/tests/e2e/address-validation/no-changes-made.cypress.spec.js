import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when updating their address without actually making a change', () => {
    it('should quickly exit edit view', () => {
      const formFields = {
        address: '123 Test Street',
        city: 'Waldorf',
        state: 'MD',
        zipCode: '20603',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('no-change');
      addressPage.updateWithoutChanges();
      addressPage.validateSavedForm(formFields, false);
      addressPage.validateFocusedElement({
        tag: 'button',
        name: /edit mailing address/i,
      });
    });
  });
});
