import { setupHomeAddressModalUpdateFailure } from './setupHomeAddressModalTests';
import AddressPage from '../address-validation/page-objects/AddressPage';
import user36 from '../../fixtures/users/user-36.json';

describe('Home address update modal - api failure', () => {
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

    cy.findByTestId('copy-address-prompt').should('be.focused');
    cy.findByTestId('copy-address-prompt')
      .shadow()
      .findByText(`We've updated your home address`)
      .should('exist');

    cy.findByTestId('save-edit-button').click({
      force: true,
    });

    cy.findByTestId('copy-address-failure').should('be.focused');
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
      .findByTestId('vap-service-error-alert')
      .should('be.focused');

    cy.injectAxeThenAxeCheck();
  });
});
