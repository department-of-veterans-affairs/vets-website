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

const mockSuccessResponse = (delay = 0) => {
  // Mock DELETE request to return success response
  cy.intercept('DELETE', '/v0/profile/email_addresses', {
    statusCode: 200,
    delay,
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
};

const removeEmailAddress = () => {
  // Click remove button for contact email
  cy.get('[data-field-name="email"]')
    .find('va-button[text="Remove"]')
    .click();

  // Confirm delete in modal
  cy.get('[data-testid="confirm-remove-button"]').click();
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
    cy.get('[data-testid="cancel-remove-button"]').click();
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
      delay: 1000, // to simulate loading state
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
    // Confirm the Remove button is in a loading state while the transaction is pending
    cy.get('[data-testid="confirm-remove-button"]').should(
      'have.attr',
      'loading',
    );
    // Confirm modal closes & error alert appears with focus
    cy.get('va-modal').should('not.exist');
    cy.get('[data-testid="generic-error-alert"]').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });

  it('should complete successfully', () => {
    // Mock DELETE & GET transaction status 200 response
    mockSuccessResponse();

    // Open remove modal & click to confirm
    removeEmailAddress();
    // Confirm the Remove button is in a loading state while the transaction is pending
    cy.get('[data-testid="confirm-remove-button"]').should(
      'have.attr',
      'loading',
    );
    // Confirm modal closes & success alert appears with focus
    cy.get('va-modal').should('not.exist');
    cy.get('[data-testid="update-success-alert"]').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });

  it('should show loading indicator when modal is closed before transaction completes', () => {
    // Mock DELETE & GET transaction status 200 response
    mockSuccessResponse(2000);

    // Open remove modal & click to confirm
    removeEmailAddress();
    // Confirm the Remove button is in a loading state while the transaction is pending
    cy.get('[data-testid="confirm-remove-button"]').should(
      'have.attr',
      'loading',
    );
    // Close the modal while loading state is active
    cy.get('va-modal')
      .shadow()
      .find('.va-modal-close')
      .click();
    // Confirm modal closes & loading indicator appears with focus
    cy.get('va-modal').should('not.exist');
    cy.get('[data-testid="loading-indicator"]').should('be.focused');
    // Confirm loading indicator disappears & success alert appears with focus
    cy.get('[data-testid="loading-indicator"]').should('not.exist');
    cy.get('[data-testid="update-success-alert"]').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });
});
