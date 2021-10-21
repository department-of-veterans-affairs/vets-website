/* eslint no-unused-expressions: "off" */
import { setUp } from '@@profile/tests/e2e/address-validation/setup';

class AddressPage {
  loadPage(config) {
    setUp(config);
  }

  fillAddressForm(fields) {
    fields.military &&
      cy
        .findByRole('checkbox', {
          name: /I live on a.*military base/i,
        })
        .check();
    fields.military && cy.get('#root_city').select('FPO');
    fields.address &&
      cy
        .findByLabelText(/^street address \(/i)
        .clear()
        .type(fields.address);
    fields.address2 &&
      cy
        .findByLabelText(/^street address line 2/i)
        .clear()
        .type(fields.address2);
    fields.address3 &&
      cy
        .findByLabelText(/^street address line 3/i)
        .clear()
        .type(fields.address3);
    fields.city &&
      cy
        .findByLabelText(/City/i)
        .clear()
        .type(fields.city);
    fields.state && cy.findByLabelText(/^State/).select(fields.state);
    fields.zipCode &&
      cy
        .findByLabelText(/Zip code/i)
        .clear()
        .type(fields.zipCode);
  }

  saveForm(confirm = false) {
    if (confirm) {
      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
    } else {
      cy.findByTestId('save-edit-button').click({
        force: true,
      });
    }
  }

  validateSavedForm(fields, saved = true, altText = null) {
    cy.findByTestId('mailingAddress')
      .should('contain', `${fields.address}`)
      .and('contain', `${fields.city}, ${fields.state} ${fields.zipCode}`);
    fields.military &&
      cy.findByTestId('mailingAddress').should('contain', 'FPO');
    saved &&
      cy
        .focused()
        .invoke('text')
        .should('match', /update saved/i);
    altText && cy.findByText(altText).should('exist');
  }

  confirmAddress(fields, alternateSuggestions = [], secondSave = false) {
    cy.findByTestId('mailingAddress').should('contain', `${fields.address}`);
    !secondSave &&
      cy
        .findByTestId('mailingAddress')
        .should('contain', 'Please confirm your address');
    alternateSuggestions.forEach(field =>
      cy.findByTestId('mailingAddress').should('contain', field),
    );
    cy.findByTestId('confirm-address-button').click({
      force: true,
    });
  }
}

export default AddressPage;
