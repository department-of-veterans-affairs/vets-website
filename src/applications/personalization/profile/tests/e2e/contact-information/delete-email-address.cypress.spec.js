import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = () => {
  cy.login(mockUser);

  mockFeatureToggles();
  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/direct_deposits',
  ]);

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: mockUser,
  });

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
};

const removeEmailAddress = () => {
  // Click remove button for contact email
  cy.get('[data-field-name="email"]')
    .find('va-button[text="Remove"]')
    .click();

  // Confirm modal appears with focus
  cy.get('va-modal').should('be.focused');

  // Confirm delete in modal
  cy.get('[data-testid="confirm-remove-modal"]')
    .shadow()
    .find('va-button')
    .first()
    .click();
};

describe('Delete email address', () => {
  beforeEach(() => {
    setup();
  });

  it('should cancel deletion when user clicks cancel', () => {
    // Open remove modal & click to cancel
    cy.get('[data-field-name="email"]')
      .find('va-button[text="Remove"]')
      .click();
    cy.get('[data-testid="confirm-remove-modal"]')
      .shadow()
      .find('va-button[secondary]')
      .click();
    // Confirm modal closes & focus is on the Remove button
    cy.get('va-modal').should('not.exist');
    cy.get('[data-field-name="email"]')
      .find('va-button[text="Remove"]')
      .shadow()
      .find('button')
      .should('have.focus');

    cy.injectAxeThenAxeCheck();
  });

  it('should show error alert if delete transaction request fails', () => {
    // Mock DELETE request to return API error response
    cy.intercept('DELETE', '/v0/profile/email_addresses', {
      statusCode: 400,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_email_address_transactions',
          attributes: {
            transactionId: 'email_address_tx_id',
            transactionStatus: 'COMPLETED_FAILURE',
            type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
            metadata: [],
          },
        },
      },
    });

    // Open remove modal & click to confirm
    removeEmailAddress();
    // Confirm modal closes & error alert appears
    cy.get('va-modal').should('not.exist');
    cy.get('[data-testid="vap-service-error-alert"]').should('be.visible');

    cy.injectAxeThenAxeCheck();
  });

  it('should complete successfully', () => {
    // Mock DELETE request to return success response
    cy.intercept('DELETE', '/v0/profile/email_addresses', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_email_adress_transactions',
          attributes: {
            transactionId: 'email_address_tx_id',
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
            metadata: [],
          },
        },
      },
    });

    // Mock GET request to return success response for transaction status
    cy.intercept('GET', '/v0/profile/status/email_address_tx_id', {
      statusCode: 200,
      body: {
        data: {
          id: 'email_address_tx_id',
          type: 'async_transaction_va_profile_email_address_transactions',
          attributes: {
            transactionId: 'email_address_tx_id',
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
            metadata: [],
          },
        },
      },
    });

    // Open remove modal & click to confirm
    removeEmailAddress();
    // Confirm modal closes & success alert appears
    cy.get('va-modal').should('not.exist');
    cy.get('[data-testid="update-success-alert"]').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });
});
