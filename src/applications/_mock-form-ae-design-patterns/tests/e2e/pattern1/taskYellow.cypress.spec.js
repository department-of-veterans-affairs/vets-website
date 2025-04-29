import manifest from '../../../manifest.json';
import mockUsers from '../../../mocks/endpoints/user';
import mockPrefills from '../../../mocks/endpoints/in-progress-forms/mock-form-ae-design-patterns';

describe('Prefill pattern - Yellow Task', () => {
  beforeEach(() => {
    cy.login(mockUsers.loa3User);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        loading: false,
        features: [],
      },
    }).as('mockFeatureToggles');
    cy.intercept('/v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS', {
      statusCode: 200,
      body: mockPrefills.prefill,
    }).as('mockSip');

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
              confidenceScore: 100,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'RESIDENTIAL',
            },
            validationKey: -1565212962,
          },
        ],
      },
    });

    cy.intercept('GET', '/v0/profile/status/*', {
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

    cy.intercept('PUT', '/v0/profile/addresses', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_address_transactions',
          attributes: {
            transactionId: 'mock-update-mailing-address-transaction-id',
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::AddressTransaction',
            metadata: [],
          },
        },
      },
    });
  });

  it('should show user as authenticated from the start', () => {
    cy.visit(`${manifest.rootUrl}/1`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('button', { name: /yellow task/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=true');

    cy.injectAxeThenAxeCheck();

    cy.findByRole('link', {
      name: /Start your health benefits update form/i,
    }).click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/personal-information');
  });

  it('should successfully show prefill data on the form', () => {
    cy.visit(`${manifest.rootUrl}/1/task-yellow/introduction?loggedIn=true`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('link', {
      name: /Start your health benefits update form/i,
    }).click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/personal-information');

    cy.injectAxeThenAxeCheck();

    cy.findByText('Mitchell G Jenkins').should('exist');

    cy.findByText('●●●–●●–6789').should('exist');

    cy.findByText('July 10, 1956').should('exist');

    cy.findByText('Male').should('exist');

    cy.findByRole('button', { name: /Continue/i }).click();

    cy.url().should('contain', '/confirm-mailing-address');

    cy.findByText('125 Main St.').should('exist');

    cy.findByText('Fulton, NY 97063').should('exist');

    cy.contains('Edit').click();

    cy.url().should('contain', '/edit-mailing-address');

    cy.findByText('Cancel').click();

    cy.url().should('contain', '/confirm-mailing-address');
  });
});
