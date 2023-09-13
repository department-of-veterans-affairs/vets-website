/* eslint no-unused-expressions: "off" */
import { setUp } from '@@profile/tests/e2e/address-validation/setup';

class AddressPage {
  loadPage = config => {
    setUp(config);
  };

  fillAddressForm = fields => {
    fields.country && cy.findByLabelText(/Country/i).select(fields.country);
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
    fields.province &&
      cy
        .findByLabelText(/^State\/Province\/Region/)
        .clear()
        .type(fields.province);
    fields.zipCode &&
      cy
        .findByLabelText(/Zip code/i)
        .clear()
        .type(fields.zipCode);
    fields.zipCodeInt &&
      cy
        .findByLabelText(/International postal code/i)
        .clear()
        .type(fields.zipCodeInt);
  };

  saveForm = (confirm = false) => {
    if (confirm) {
      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
    } else {
      cy.findByTestId('save-edit-button').click({
        force: true,
        waitForAnimations: true,
      });
    }
  };

  validateSavedForm = (
    fields,
    saved = true,
    altText = null,
    additionalFields = [],
  ) => {
    !fields.country &&
      cy
        .findByTestId('mailingAddress')
        .should('contain', `${fields.address}`)
        .and('contain', `${fields.city}, ${fields.state} ${fields.zipCode}`);
    fields.country &&
      cy.findByTestId('mailingAddress').should('contain', `${fields.address}`);
    fields.zipCodeInt &&
      cy.findByTestId('mailingAddress').and('contain', `${fields.zipCodeInt}`);
    additionalFields.forEach(field => {
      cy.findByTestId('mailingAddress').should('contain', field);
    });
    fields.military &&
      cy.findByTestId('mailingAddress').should('contain', 'FPO');
    if (saved) {
      cy.findByTestId('update-success-alert').should('exist');
      cy.get('#edit-mailing-address').should('exist');
      cy.focused().then($focused => {
        expect($focused).to.have.attr('aria-label', 'Edit Mailing address');
        expect($focused).to.have.text('Edit');
      });
    }

    altText && cy.findByText(altText).should('exist');
  };

  confirmAddress = (
    fields,
    alternateSuggestions = [],
    secondSave = false,
    missingUnit = false,
  ) => {
    cy.findByTestId('mailingAddress').should('contain', `${fields.address}`);
    !secondSave &&
      cy
        .findByTestId('mailingAddress')
        .should(
          'contain',
          'We can’t confirm the address you entered with the U.S. Postal Service.',
        );
    alternateSuggestions.forEach(field =>
      cy.findByTestId('mailingAddress').should('contain', field),
    );
    missingUnit &&
      cy
        .findByTestId('mailingAddress')
        .should('contain', 'Confirm your address');
    cy.findByTestId('confirm-address-button').click({
      force: true,
    });
  };

  confirmAddressFields = (labels, fields) => {
    labels.forEach((label, i) => {
      cy.findByLabelText(label).should('have.value', fields[i]);
      cy.findAllByLabelText(label).should('have.value', fields[i]);
    });
  };

  editAddress = (labels, fields) => {
    cy.findByRole('button', { name: /go back to edit/i }).click();
    this.confirmAddressFields(labels, fields);
    cy.findByRole('button', { name: /^Save$/i }).click({ force: true });
    cy.findByRole('button', { name: /^use this address$/i }).click({
      force: true,
    });
  };

  updateWithoutChanges = () => {
    cy.findByRole('button', { name: /^save$/i }).should(
      'not.have.attr',
      'disabled',
    );
    cy.findByRole('button', { name: /^save$/i }).click({
      force: true,
    });
    cy.findByRole('button', { name: /^save$/i, timeout: 10 }).should(
      'not.exist',
    );
  };

  validateFocusedElement = element => {
    cy.findByRole(element.tag, { name: element.name }).should('be.focused');
  };
}

export default AddressPage;
