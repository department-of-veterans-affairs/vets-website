import { setUp } from '@@profile/tests/e2e/address-validation/setup';

class AddressPage {
  loadPage(config) {
    setUp(config);
  }

  fillAddressForm(fields) {
    cy.findByLabelText(/^street address \(/i)
      .clear()
      .type(fields.address);
    cy.findByLabelText(/^street address line 2/i).clear();
    cy.findByLabelText(/^street address line 3/i).clear();

    cy.findByLabelText(/City/i)
      .clear()
      .type(fields.city);
    cy.findByLabelText(/^State/).select(fields.state);
    cy.findByLabelText(/Zip code/i)
      .clear()
      .type(fields.zipCode);
  }

  saveForm() {
    cy.findByTestId('save-edit-button').click({
      force: true,
    });
  }

  validateSavedForm(fields) {
    cy.findByTestId('mailingAddress')
      .should('contain', `${fields.address}`)
      .and('contain', `${fields.city}, ${fields.state} ${fields.zipCode}`);
    cy.focused()
      .invoke('text')
      .should('match', /update saved/i);
  }

  confirmAddressMessage(fields) {
    cy.findByTestId('mailingAddress')
      .should('contain', `${fields.address}`)
      .and('contain', 'Please confirm your address');
  }
}

export default AddressPage;
