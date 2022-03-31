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

    cy.findByTestId('modal-content').should('exist');

    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    cy.findByTestId('modal-content').should('exist');

    cy.findByText(`We've updated your mailing address`).should('exist');

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

    cy.findByTestId('modal-content').should('exist');

    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    cy.findByTestId('modal-content').should('exist');

    cy.findByText(`We can't update your mailing address`).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
