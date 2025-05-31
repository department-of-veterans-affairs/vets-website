import { mockUser } from '../user';

describe('Welcome VA Setup - Contact info', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {},
    }).as('mockFeatureToggles');
    cy.intercept('/v0/in_progress_forms/WELCOME_VA_SETUP_REVIEW_INFORMATION', {
      statusCode: 200,
    }).as('mockSip');
    cy.intercept('GET', '/v0/user*', mockUser).as('mockUser');

    cy.intercept('GET', '/v0/profile/status', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            data: {
              id: '',
              type: 'async_transaction_va_profile_mock_transactions',
              attributes: {
                transactionId: 'mock-update-mailing-address-transaction-id',
                transactionStatus: 'COMPLETED_SUCCESS',
                type: 'AsyncTransaction::VAProfile::MockTransaction',
                metadata: [],
              },
            },
          },
        },
      },
    });
  });
  context('API returns 200', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/telephones', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'async_transaction_va_profile_mock_transactions',
            attributes: {
              transactionId: 'mock-update-phone-transaction-id',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::VAProfile::MockTransaction',
              metadata: [],
            },
          },
        },
      });

      cy.intercept('/v0/profile/status/mock-update-phone-transaction-id', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'async_transaction_va_profile_mock_transactions',
            attributes: {
              transactionId: 'mock-update-phone-transaction-id',
              transactionStatus: 'COMPLETED_SUCCESS',
              type: 'AsyncTransaction::VAProfile::MockTransaction',
              metadata: [],
            },
          },
        },
      });
    });

    it('changing phone number succeeds', () => {
      cy.visit('my-va/welcome-va-setup/contact-information');

      cy.findByRole('link', {
        name: /Edit mobile phone number/i,
      }).click();

      cy.injectAxeThenAxeCheck();

      cy.get('va-text-input[name="root_inputPhoneNumber"]')
        .shadow()
        .find('input')
        .as('homePhoneInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@homePhoneInput').clear();
      cy.get('@homePhoneInput').type('5558985555');
      cy.findByTestId('save-edit-button').click();

      // redirect to previous page and show save alert
      cy.url().should('not.contain', 'edit-mobile-phone');
      cy.findByText('Mobile phone number updated').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('API returns 500', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/telephones', {
        statusCode: 500,
        body: { status: 500, error: 'Internal Server Error', exception: {} },
      });
    });
    it('changing phone number fails', () => {
      cy.visit('my-va/welcome-va-setup/contact-information');

      cy.findByRole('link', {
        name: /Edit mobile phone number/i,
      }).click();

      cy.injectAxeThenAxeCheck();

      cy.get('va-text-input[name="root_inputPhoneNumber"]')
        .shadow()
        .find('input')
        .as('homePhoneInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@homePhoneInput').clear();
      cy.get('@homePhoneInput').type('5558985555');
      cy.findByTestId('save-edit-button').click();

      // stay on current page and show error alert
      cy.url().should(
        'contain',
        '/welcome-va-setup/contact-information/edit-mobile-phone',
      );
      cy.findAllByRole('alert', { status: 'error' }).should('exist');
    });
  });
});
