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
  if (fields.military) {
    cy.selectVaCheckbox('root_view:livesOnMilitaryBase', true);
    cy.selectVaSelect('root_city', 'FPO');
  }

  if (fields.country) {
    cy.selectVaSelect('root_countryCodeIso3', fields.country);
  }

  if (fields.address) {
    cy.fillVaTextInput('root_addressLine1', fields.address);
  }

  if (fields.address2) {
    cy.fillVaTextInput('root_addressLine2', fields.address2);
  }

  if (fields.address3) {
    cy.fillVaTextInput('root_addressLine3', fields.address3);
  }

  if (fields.city && !fields.military) {
    cy.fillVaTextInput('root_city', fields.city);
  }

  if (fields.state) {
    cy.selectVaSelect('root_stateCode', fields.state);
  }

  if (fields.province) {
    cy.fillVaTextInput('root_province', fields.province);
  }

  if (fields.zipCode) {
    cy.fillVaTextInput('root_zipCode', fields.zipCode);
  }

  if (fields.zipCodeInt) {
    cy.fillVaTextInput('root_internationalPostalCode', fields.zipCodeInt);
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
    cy.get(`[label^="${label}"]`).should('have.value', fields[i]);
  });
};

const editAddress = (labels, fields) => {
  cy.get('va-button[text="Go back to edit"]').click();
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
    Cypress.config({
      force: true,
      waitForAnimations: true,
      scrollBehavior: 'nearest',
    });
  };

  fillAddressForm = fields => {
    if (fields.military) {
      cy.selectVaCheckbox('root_view:livesOnMilitaryBase', true);
      cy.selectVaRadioOption('root_city', 'FPO');
    }

    if (fields.country) {
      cy.selectVaSelect('root_countryCodeIso3', fields.country);
    }

    if (fields.address) {
      cy.fillVaTextInput('root_addressLine1', fields.address);
    }

    if (fields.address2) {
      cy.fillVaTextInput('root_addressLine2', fields.address2);
    }

    if (fields.address3) {
      cy.fillVaTextInput('root_addressLine3', fields.address3);
    }

    if (fields.city && !fields.military) {
      cy.fillVaTextInput('root_city', fields.city);
    }

    if (fields.state && !fields.military) {
      cy.selectVaSelect('root_stateCode', fields.state);
    }

    if (fields.state && fields.military) {
      cy.selectVaRadioOption('root_stateCode', fields.state);
    }

    if (fields.province) {
      cy.fillVaTextInput('root_province', fields.province);
    }

    if (fields.zipCode) {
      cy.fillVaTextInput('root_zipCode', fields.zipCode);
    }

    if (fields.zipCodeInt) {
      cy.fillVaTextInput('root_internationalPostalCode', fields.zipCodeInt);
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
      cy.get(`[label^="${label}"]`).should('have.value', fields[i]);
    });
  };

  editAddress = (labels, fields) => {
    cy.get('va-button[text="Go back to edit"]').click();
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
