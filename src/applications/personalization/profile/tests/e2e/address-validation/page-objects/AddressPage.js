import { setUp } from '@@profile/tests/e2e/address-validation/setup';

class AddressPage {
  loadPage(config) {
    setUp(config);
  }

  fillAddressForm(fields) {
    // eslint-disable-next-line no-unused-expressions
    fields.address &&
      cy
        .findByLabelText(/^street address \(/i)
        .clear()
        .type(fields.address);
    // eslint-disable-next-line no-unused-expressions
    fields.address2 &&
      cy
        .findByLabelText(/^street address line 2/i)
        .clear()
        .type(fields.address2);
    // eslint-disable-next-line no-unused-expressions
    fields.address3 &&
      cy
        .findByLabelText(/^street address line 3/i)
        .clear()
        .type(fields.address3);
    // eslint-disable-next-line no-unused-expressions
    fields.city &&
      cy
        .findByLabelText(/City/i)
        .clear()
        .type(fields.city);
    // eslint-disable-next-line no-unused-expressions
    fields.state && cy.findByLabelText(/^State/).select(fields.state);
    // eslint-disable-next-line no-unused-expressions
    fields.zipCode &&
      cy
        .findByLabelText(/Zip code/i)
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

  confirmAddress(fields) {
    cy.findByTestId('mailingAddress')
      .should('contain', `${fields.address}`)
      .and('contain', 'Please confirm your address');
    cy.findByTestId('confirm-address-button').click({
      force: true,
    });
  }
}

export default AddressPage;
