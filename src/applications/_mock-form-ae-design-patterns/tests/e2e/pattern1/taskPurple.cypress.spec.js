import manifest from '../../../manifest.json';
import mockUsers from '../../../mocks/endpoints/user';
import mockPrefills from '../../../mocks/endpoints/in-progress-forms/mock-form-ae-design-patterns';

describe('Prefill pattern - Yellow Task', () => {
  beforeEach(() => {
    cy.login(mockUsers.loa3User72);
    cy.intercept('GET', '/v0/feature_toggles*', { loading: false }).as(
      'mockFeatureToggles',
    );
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

    cy.findByRole('button', { name: /purple task/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=true');

    cy.injectAxeThenAxeCheck();

    cy.findByText('Request a Board Appeal').should('exist');

    cy.findAllByRole('link', {
      name: /Start the Board Appeal request/i,
    })
      .first()
      .click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/veteran-information');
  });

  it('should successfully show prefill data on the form', () => {
    cy.visit(`${manifest.rootUrl}/1/task-purple/introduction?loggedIn=true`);

    cy.injectAxeThenAxeCheck();

    cy.findAllByRole('link', {
      name: /Start the Board Appeal request/i,
    })
      .first()
      .click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/veteran-information');

    cy.injectAxeThenAxeCheck();

    cy.findByText('Home phone number').should('exist');
    cy.get('va-telephone[contact="9898981233"]').should('exist');

    cy.findByText('Mobile phone number').should('exist');
    cy.get('va-telephone[contact="6195551234"]').should('exist');

    cy.findByText('Email address').should('exist');
    cy.findByText('myemail72585885@unattended.com').should('exist');

    cy.findByText('Mailing address').should('exist');
    cy.findByText('123 Mailing Address St.').should('exist');
    cy.findByText('Fulton, NY 97063').should('exist');

    cy.findByRole('button', { name: /Continue/i }).click();

    cy.url().should('contain', 'mock-form-ae-design-patterns/');
  });
});
