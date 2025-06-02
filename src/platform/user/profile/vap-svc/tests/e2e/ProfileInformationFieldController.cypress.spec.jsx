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
  context('Mobile phone - API returns 200', () => {
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
        .as('mobilePhoneInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@mobilePhoneInput').clear();
      cy.get('@mobilePhoneInput').type('5558985555');
      cy.findByTestId('save-edit-button').click();

      // redirect to previous page and show save alert
      cy.url().should('not.contain', 'edit-mobile-phone');
      cy.findByText('Mobile phone number updated').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('Mobile phone - API returns 500', () => {
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
        .as('mobilePhoneInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@mobilePhoneInput').clear();
      cy.get('@mobilePhoneInput').type('5558985555');
      cy.findByTestId('save-edit-button').click();

      // stay on current page and show error alert
      cy.url().should(
        'contain',
        '/welcome-va-setup/contact-information/edit-mobile-phone',
      );
      cy.findAllByRole('alert', { status: 'error' }).should('exist');
    });
  });

  context('Email - API returns 200', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/email_addresses', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type:
              'async_transaction_va_profile_asynctransaction::vaprofile::emailtransaction_transactions',
            attributes: {
              transactionId: 'mock-update-email-success-transaction-id',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::VAProfile::EmailTransaction',
              metadata: [],
            },
          },
        },
      });

      cy.intercept(
        '/v0/profile/status/mock-update-email-success-transaction-id',
        {
          statusCode: 200,
          body: {
            data: {
              id: '',
              type: 'async_transaction_va_profile_mock_transactions',
              attributes: {
                transactionId: 'mock-update-email-success-transaction-id',
                transactionStatus: 'COMPLETED_SUCCESS',
                type: 'AsyncTransaction::VAProfile::MockTransaction',
                metadata: [],
              },
            },
          },
        },
      );
    });

    it('changing email succeeds', () => {
      cy.visit('my-va/welcome-va-setup/contact-information');

      cy.findByRole('link', {
        name: /Edit email address/i,
      }).click();

      cy.injectAxeThenAxeCheck();

      cy.get('va-text-input[name="root_emailAddress"]')
        .shadow()
        .find('input')
        .as('emailInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@emailInput').clear();
      cy.get('@emailInput').type('test@va.gov');
      cy.findByTestId('save-edit-button').click();

      // redirect to previous page and show save alert
      cy.url().should('not.contain', 'edit-email-address');
      cy.findByText('Email address updated').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('Email - API returns 500', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/email_addresses', {
        statusCode: 500,
        body: { status: 500, error: 'Internal Server Error', exception: {} },
      });
    });
    it('changing email fails', () => {
      cy.visit('my-va/welcome-va-setup/contact-information');

      cy.findByRole('link', {
        name: /Edit email address/i,
      }).click();

      cy.injectAxeThenAxeCheck();

      cy.get('va-text-input[name="root_emailAddress"]')
        .shadow()
        .find('input')
        .as('emailInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@emailInput').clear();
      cy.get('@emailInput').type('test@va.gov');
      cy.findByTestId('save-edit-button').click();

      // stay on current page and show error alert
      cy.url().should(
        'contain',
        '/welcome-va-setup/contact-information/edit-email-address',
      );
      cy.findAllByRole('alert', { status: 'error' }).should('exist');
    });
  });

  context('Mailing Address - API returns 200', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/addresses', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type:
              'async_transaction_va_profile_asynctransaction::vaprofile::addresstransaction_transactions',
            attributes: {
              transactionId:
                'mock-update-mailing-address-success-transaction-id',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::VAProfile::EmailTransaction',
              metadata: [],
            },
          },
        },
      });

      cy.intercept(
        '/v0/profile/status/mock-update-mailing-address-success-transaction-id',
        {
          statusCode: 200,
          body: {
            data: {
              id: '',
              type: 'async_transaction_va_profile_mock_transactions',
              attributes: {
                transactionId:
                  'mock-update-mailing-address-success-transaction-id',
                transactionStatus: 'COMPLETED_SUCCESS',
                type: 'AsyncTransaction::VAProfile::MockTransaction',
                metadata: [],
              },
            },
          },
        },
      );
      cy.intercept('/v0/profile/address_validation', {
        statusCode: 200,
        body: {
          addresses: [
            {
              address: {
                addressLine1: '345 Mailing Address St.',
                city: 'Fulton',
                stateCode: 'NY',
                zipCode: '97063',
              },
              addressMetaData: {
                confidenceScore: 88,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'RESIDENTIAL',
              },
              validationKey: -1565212962,
            },
          ],
        },
      });
    });

    it('changing mailing address succeeds - low confidence on address validation', () => {
      cy.visit('my-va/welcome-va-setup/contact-information');

      cy.findByRole('link', {
        name: /Edit mailing address/i,
      }).click();

      cy.injectAxeThenAxeCheck();

      cy.get('va-text-input[name="root_addressLine1"]')
        .shadow()
        .find('input')
        .as('streetInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@streetInput').clear();
      cy.get('@streetInput').type('12 Madison Ave');
      cy.findByTestId('save-edit-button').click();

      // goes to confirm maiing address page
      cy.findByTestId('confirm-address-button').click();

      // redirect to previous page and show save alert
      cy.url().should('not.contain', 'edit-email-address');
      cy.findByText('Email address updated').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('Mailing Address - API returns 500', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/addresses', {
        statusCode: 500,
        body: { status: 500, error: 'Internal Server Error', exception: {} },
      });
      cy.intercept('/v0/profile/address_validation', {
        statusCode: 200,
        body: {
          addresses: [
            {
              address: {
                addressLine1: '345 Mailing Address St.',
                city: 'Fulton',
                stateCode: 'NY',
                zipCode: '97063',
              },
              addressMetaData: {
                confidenceScore: 88,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'RESIDENTIAL',
              },
              validationKey: -1565212962,
            },
          ],
        },
      });
    });
    it('changing mailing address fails - low confidence on address validation', () => {
      cy.visit('my-va/welcome-va-setup/contact-information');

      cy.findByRole('link', {
        name: /Edit mailing address/i,
      }).click();

      cy.injectAxeThenAxeCheck();

      cy.get('va-text-input[name="root_addressLine1"]')
        .shadow()
        .find('input')
        .as('streetInput');

      cy.injectAxeThenAxeCheck();

      cy.get('@streetInput').clear();
      cy.get('@streetInput').type('12 Madison Ave');
      cy.findByTestId('save-edit-button').click();

      // goes to confirm maiing address page
      cy.findByTestId('confirm-address-button').click();

      // stay on current page and show error alert
      cy.url().should(
        'contain',
        '/welcome-va-setup/contact-information/edit-mailing-address',
      );
      cy.findAllByRole('alert', { status: 'error' }).should('exist');
    });
  });
});
