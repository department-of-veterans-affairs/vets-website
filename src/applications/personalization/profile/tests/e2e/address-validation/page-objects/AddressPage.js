/* eslint no-unused-expressions: "off" */
import { setUp } from '@@profile/tests/e2e/address-validation/setup';

const loadPage = config => {
  setUp(config);
};

const validateSavedForm = (
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
  fields.military && cy.findByTestId('mailingAddress').should('contain', 'FPO');
  if (saved) {
    cy.findByTestId('update-success-alert', { timeout: 10000 }).should('exist');
    cy.get('#edit-mailing-address').should('exist');

    // this linting warning is actually a bug in cypress
    // https://github.com/cypress-io/eslint-plugin-cypress/issues/140
    cy.focused().then($focused => {
      expect($focused).to.have.attr('aria-label', 'Edit Mailing address');
      expect($focused).to.have.text('Edit');
    });
  }

  altText && cy.findByText(altText).should('exist');
};

const fillAddressForm = fields => {
  fields.country && cy.findByLabelText(/Country/i).select(fields.country);
  fields.military &&
    cy
      .findByRole('checkbox', {
        name: /I live on a.*military base/i,
      })
      .check();
  fields.military && cy.get('#root_city').select('FPO');

  if (fields.address) {
    cy.findByLabelText(/^street address \(/i).as('address1');
    cy.get('@address1').click();
    cy.get('@address1').clear();
    cy.findByLabelText(/^street address \(/i).type(fields.address);
  }

  if (fields.address2) {
    cy.findByLabelText(/^street address line 2/i).as('address2');
    cy.get('@address2').click();
    cy.get('@address2').clear();
    cy.get('@address2').type(fields.address2);
  }

  if (fields.address3) {
    cy.findByLabelText(/^street address line 3/i).as('address3');

    cy.get('@address3').click();
    cy.get('@address3').clear();
    cy.get('@address3').type(fields.address3);
  }

  if (fields.city) {
    cy.findByLabelText(/City/i).as('city');

    cy.get('@city').click();
    cy.get('@city').clear();
    cy.get('@city').type(fields.city);
  }

  fields.state && cy.findByLabelText(/^State/).select(fields.state);

  if (fields.province) {
    cy.findByLabelText(/^State\/Province\/Region/).as('state');

    cy.get('@state').click();
    cy.get('@state').clear();
    cy.get('@state').type(fields.province);
  }

  if (fields.zipCode) {
    cy.findByLabelText(/Zip code/i).as('zipCode');

    cy.get('@zipCode').click();
    cy.get('@zipCode').clear();
    cy.get('@zipCode').type(fields.zipCode);
  }

  if (fields.zipCodeInt) {
    cy.findByLabelText(/International postal code/i).as('zipCodeInt');

    cy.get('@zipCodeInt').click();
    cy.get('@zipCodeInt').clear();
    cy.get('@zipCodeInt').type(fields.zipCodeInt);
  }
};

const saveForm = (confirm = false) => {
  if (confirm) {
    cy.findByTestId('confirm-address-button').click({
      force: true,
      waitForAnimations: true,
    });
  } else {
    cy.findByTestId('save-edit-button').click({
      force: true,
      waitForAnimations: true,
    });
  }
};

const confirmAddress = (
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
    cy.findByTestId('mailingAddress').should('contain', 'Confirm your address');
  cy.findByTestId('confirm-address-button').click({
    force: true,
    waitForAnimations: true,
  });
};

const confirmAddressFields = (labels, fields) => {
  labels.forEach((label, i) => {
    cy.findByLabelText(label).should('have.value', fields[i]);
    cy.findAllByLabelText(label).should('have.value', fields[i]);
  });
};

const editAddress = (labels, fields) => {
  cy.findByRole('button', { name: /go back to edit/i }).click();
  confirmAddressFields(labels, fields);
  cy.findByTestId('save-edit-button').click({
    force: true,
    waitForAnimations: true,
  });
  cy.findByTestId('confirm-address-button').click({
    force: true,
    waitForAnimations: true,
  });
};

const updateWithoutChanges = () => {
  cy.findByRole('button', { name: /^save$/i }).should(
    'not.have.attr',
    'disabled',
  );
  cy.findByRole('button', { name: /^save$/i }).click({
    force: true,
  });
  cy.findByRole('button', { name: /^save$/i, timeout: 10 }).should('not.exist');
};

const validateFocusedElement = element => {
  cy.findByRole(element.tag, { name: element.name }).should('be.focused');
};

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

    if (fields.address) {
      cy.findByLabelText(/^street address \(/i).as('address1');
      cy.get('@address1').click();
      cy.get('@address1').clear();
      cy.findByLabelText(/^street address \(/i).type(fields.address);
    }

    if (fields.address2) {
      cy.findByLabelText(/^street address line 2/i).as('address2');
      cy.get('@address2').click();
      cy.get('@address2').clear();
      cy.get('@address2').type(fields.address2);
    }

    if (fields.address3) {
      cy.findByLabelText(/^street address line 3/i).as('address3');

      cy.get('@address3').click();
      cy.get('@address3').clear();
      cy.get('@address3').type(fields.address3);
    }

    if (fields.city) {
      cy.findByLabelText(/City/i).as('city');

      cy.get('@city').click();
      cy.get('@city').clear();
      cy.get('@city').type(fields.city);
    }

    fields.state && cy.findByLabelText(/^State/).select(fields.state);

    if (fields.province) {
      cy.findByLabelText(/^State\/Province\/Region/).as('state');

      cy.get('@state').click();
      cy.get('@state').clear();
      cy.get('@state').type(fields.province);
    }

    if (fields.zipCode) {
      cy.findByLabelText(/Zip code/i).as('zipCode');

      cy.get('@zipCode').click();
      cy.get('@zipCode').clear();
      cy.get('@zipCode').type(fields.zipCode);
    }

    if (fields.zipCodeInt) {
      cy.findByLabelText(/International postal code/i).as('zipCodeInt');

      cy.get('@zipCodeInt').click();
      cy.get('@zipCodeInt').clear();
      cy.get('@zipCodeInt').type(fields.zipCodeInt);
    }
  };

  saveForm = (confirm = false) => {
    if (confirm) {
      cy.findByTestId('confirm-address-button').click({
        force: true,
        waitForAnimations: true,
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
      cy.wait('@mockUser');
      cy.findByTestId('update-success-alert', { timeout: 10000 }).should(
        'exist',
      );
      cy.get('#edit-mailing-address').should('exist');

      // this linting warning is actually a bug in cypress
      // https://github.com/cypress-io/eslint-plugin-cypress/issues/140
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
      waitForAnimations: true,
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
    cy.findByTestId('save-edit-button').click({
      force: true,
      waitForAnimations: true,
    });
    cy.findByTestId('confirm-address-button').click({
      force: true,
      waitForAnimations: true,
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

export {
  loadPage,
  fillAddressForm,
  saveForm,
  validateSavedForm,
  confirmAddress,
  confirmAddressFields,
  editAddress,
  updateWithoutChanges,
  validateFocusedElement,
};

export default AddressPage;
