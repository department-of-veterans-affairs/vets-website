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

const editEmailAddress = email => {
  // Click edit button in the contact email section to enter edit view
  cy.get('[data-field-name="email"]')
    .find('va-button[text="Edit"]')
    .click();

  // Clear and update email address field
  cy.get('va-text-input[name="root_emailAddress"]')
    .shadow()
    .find('input')
    .clear();
  cy.get('va-text-input[name="root_emailAddress"]')
    .shadow()
    .find('input')
    .type(email);

  // Click to save
  cy.get('[data-testid="save-edit-button"]').click();
};

describe('Edit email address', () => {
  beforeEach(() => {
    setup();
  });

  const newEmail = 'newemail@domain.com';

  it('should show error alert in edit view if update transaction request fails', () => {
    // Mock PUT request to return API error response
    cy.intercept('PUT', '/v0/profile/email_addresses', {
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

    // Update the email address & click to save
    editEmailAddress(newEmail);
    // Confirm error alert appears in edit view
    cy.get('[data-testid="edit-error-alert"]').should('be.visible');

    cy.injectAxeThenAxeCheck();
  });

  it('should complete successfully', () => {
    // Mock PUT request to return success response
    cy.intercept('PUT', '/v0/profile/email_addresses', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_email_address_transactions',
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

    // Update the email address & click to save
    editEmailAddress(newEmail);
    // Confirm the Save button is in a loading state while the transaction is pending
    cy.get('[data-testid="save-edit-button"]').should('have.attr', 'loading');
    // Confirm edit view exits & update success alert appears
    cy.get('[data-field-name="email"]')
      .find('va-button[text="Edit"]')
      .should('exist');
    cy.get('[data-testid="update-success-alert"]').should('be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
