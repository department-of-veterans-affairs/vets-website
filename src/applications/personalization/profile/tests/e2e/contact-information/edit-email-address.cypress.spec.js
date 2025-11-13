import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

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
  }).as('finalUserRequest');

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
  cy.wait('@mockUser');
};

const editEmailAddress = email => {
  // Click edit button in the contact email section to enter edit view
  cy.get('#edit-contact-email-address').click();

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
  cy.findByTestId('save-edit-button').click();
};

describe('Edit email address', () => {
  beforeEach(() => {
    setup();
    // Clear the MHV email confirmation alert cookie to ensure clean test state
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
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
    }).as('updateEmailFailure');

    // Update the email address & click to save
    editEmailAddress(newEmail);

    // Wait for the API call to complete
    cy.wait('@updateEmailFailure');

    // Confirm error alert appears in edit view
    cy.findByTestId('edit-error-alert').should('be.visible');

    // Verify the MHV email confirmation alert cookie was NOT set
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

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
    }).as('updateEmailRequest');

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
    }).as('getTransactionStatus');

    // Update the email address & click to save
    editEmailAddress(newEmail);

    // Wait for the PUT request to complete
    cy.wait('@updateEmailRequest');

    // Confirm the Save button is in a loading state while the transaction is pending
    cy.findByTestId('save-edit-button').should('have.attr', 'loading');

    // Wait for the transaction status polling to complete
    cy.wait('@getTransactionStatus');
    cy.wait('@finalUserRequest');

    // Confirm edit view exits & Edit button is visible again
    cy.get('#edit-contact-email-address').should('be.visible');
    cy.findByTestId('update-success-alert').should('be.focused');

    // Verify the MHV email confirmation alert cookie was set
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('exist');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should(
      'have.property',
      'value',
      'true',
    );

    cy.injectAxeThenAxeCheck();
  });
});
