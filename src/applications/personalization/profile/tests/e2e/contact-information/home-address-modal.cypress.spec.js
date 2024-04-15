import {
  setupHomeAddressModalUpdateSuccess,
  setupHomeAddressModalUpdateFailure,
} from './setupHomeAddressModalTests';
import AddressPage from '../address-validation/page-objects/AddressPage';
import user36 from '../../fixtures/users/user-36.json';

describe('Home address update modal', () => {
  it('should NOT SHOW update prompt modal', () => {
    const formFields = {
      address: '36320 Coronado Dr',
      city: 'Fremont',
      state: 'MD',
      zipCode: '94536',
    };

    setupHomeAddressModalUpdateSuccess('valid-address');

    const addressPage = new AddressPage();
    addressPage.fillAddressForm(formFields);
    addressPage.saveForm();

    cy.findByTestId('modal-content').should('not.exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should show update prompt modal and save successfully', () => {
    const formFields = {
      address: '36320 Coronado Dr',
      city: 'Fremont',
      state: 'MD',
      zipCode: '94536',
    };

    setupHomeAddressModalUpdateSuccess('valid-address');

    const addressPage = new AddressPage();

    cy.intercept('GET', '/v0/user?*', {
      statusCode: 200,
      body: user36,
    });

    addressPage.fillAddressForm(formFields);
    addressPage.saveForm();

    cy.findByTestId('copy-address-prompt')
      .shadow()
      .findByText(`We've updated your home address`)
      .should('exist');

    cy.findByTestId('save-edit-button').click({
      force: true,
      waitForAnimations: true,
    });

    cy.findByTestId('copy-address-success')
      .shadow()
      .findByText(`We've updated your mailing address`)
      .should('exist');

    cy.findByTestId('copy-address-success')
      .shadow()
      .findByLabelText(`Close We've updated your mailing address modal`)
      .should('exist')
      .click({
        force: true,
        waitForAnimations: true,
      });

    cy.findByTestId('mailingAddress')
      .findByTestId('update-success-alert')
      .should('exist');

    cy.findByTestId('residentialAddress')
      .findByTestId('update-success-alert')
      .should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should show update prompt modal and show error when updating fails', () => {
    const formFields = {
      address: '36320 Coronado Dr',
      city: 'Fremont',
      state: 'MD',
      zipCode: '94536',
    };

    setupHomeAddressModalUpdateFailure('valid-address');

    const addressPage = new AddressPage();

    cy.intercept('GET', '/v0/user?*', {
      statusCode: 200,
      body: user36,
    });

    addressPage.fillAddressForm(formFields);
    addressPage.saveForm();

    cy.findByTestId('copy-address-prompt')
      .shadow()
      .findByText(`We've updated your home address`)
      .should('exist');

    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    cy.findByTestId('copy-address-failure')
      .shadow()
      .findByText(`We can't update your mailing address`)
      .should('exist');

    cy.findByTestId('copy-address-failure')
      .shadow()
      .findByLabelText(`Close We can't update your mailing address modal`)
      .click({
        force: true,
        waitForAnimations: true,
      });

    cy.findByTestId('mailingAddress')
      .get('.usa-input-error-message')
      .should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
