import manifest from '../../../manifest.json';
// eslint-disable-next-line import/no-duplicates
import mockUsers from '../../../mocks/endpoints/user';
import mockPrefills from '../../../mocks/endpoints/in-progress-forms/mock-form-ae-design-patterns';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';
// eslint-disable-next-line import/no-duplicates

describe('Prefill pattern - Blue Task', () => {
  beforeEach(() => {
    // mockInterceptors();
    cy.login(mockUsers.loa3User);

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
              addressType: 'DOMESTIC',
              city: 'Fulton',
              countryCodeIso3: 'USA',
              stateCode: 'NY',
              zipCode: '97063',
              addressPou: 'CORRESPONDENCE',
            },
            addressMetaData: {
              confidenceScore: 100,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'RESIDENTIAL',
            },
          },
        ],
        validationKey: -1565212962,
      },
    });

    cy.intercept('PUT', '/v0/profile/addresses', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type:
            'async_transaction_va_profile_asynctransaction::vaprofile::addresstransaction_transactions',
          attributes: {
            transactionId: 'mock-update-mailing-address-success-transaction-id',
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::AddressTransaction',
            metadata: [],
          },
        },
      },
    });

    cy.intercept(
      'GET',
      '/v0/user?now=*',
      mockUsers.loa3UserWithUpdatedMailingAddress,
    ).as('mockUserUpdated');

    cy.intercept('GET', '/v0/profile/status/*', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_mock_transactions',
          attributes: {
            transactionId: 'mock-update-mailing-address-success-transaction-id',
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::VAProfile::MockTransaction',
            metadata: [],
          },
        },
      },
    });

    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        aedpPrefill: true,
      }),
    );
  });

  it('should show user as authenticated from the start', () => {
    cy.visit(`${manifest.rootUrl}/2`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('button', { name: /blue/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=true');

    cy.injectAxeThenAxeCheck();

    cy.findByText('Request a Board Appeal').should('exist');

    cy.findAllByRole('link', {
      name: /Start the Board Appeal request/i,
    })
      .first()
      .click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/personal-information');

    cy.findByRole('button', { name: /continue/i }).click();

    cy.url().should('contain', '/veteran-information');
  });

  it('should successfully show prefill data on the form and allow updating mailing address', () => {
    // cy.visit(`${manifest.rootUrl}/2/task-blue/veteran-information`);
    cy.visit(`${manifest.rootUrl}/2/task-blue/introduction?loggedIn=true`);

    cy.injectAxeThenAxeCheck();

    // there are two buttons with the same text, so we need to find the first one
    cy.findAllByRole('link', {
      name: /Start the Board Appeal request/i,
    })
      .first()
      .click();

    cy.wait('@mockSip');

    cy.url().should('contain', '/personal-information');

    cy.findByRole('button', { name: /continue/i }).click();

    // check prefilled contact info page
    cy.url().should('contain', '/veteran-information');

    cy.findByText('Mobile phone number (optional)').should('exist');
    cy.get('va-telephone[contact="5554044567"]').should('exist');

    cy.findByText('Email address (optional)').should('exist');
    cy.findByText('Mitchell.Jenkins.Test@gmail.com').should('exist');

    cy.findByText('Mailing address').should('exist');
    cy.findByText('125 Main St.').should('exist');
    cy.findByText('Fulton, NY 97063').should('exist');

    cy.injectAxeThenAxeCheck();

    cy.get('va-link[label="Edit mailing address"]').click();
    // update mailing address and save form
    // cy.findByLabelText('Edit mailing address').click();

    // need this to access the input in the web component shadow dom
    cy.get('va-text-input[name="root_addressLine1"]')
      .shadow()
      .find('input')
      .as('addressInput');

    cy.get('@addressInput').clear();
    cy.get('@addressInput').type('345 Mailing Address St.');

    cy.findByTestId('save-edit-button').click();

    cy.wait('@mockUserUpdated'); // Make sure this intercept matches the actual API call.

    // redirect to previous page and show save alert
    cy.url().should('contain', '/veteran-information');
    cy.findByText('We’ve updated your contact information.').should('exist');
    cy.findByText(
      'We’ve made these changes to this form and your VA.gov profile.',
    ).should('exist');
    cy.findByText('Mailing address').should('exist');
    cy.get('div[data-dd-action-name="street"]').should(
      'have.text',
      '345 Mailing Address St.',
    );

    // once the task is complete it should redirect to the pattern landing page
    cy.findByRole('button', { name: /Continue/i }).click();
    cy.url().should('contain', 'mock-form-ae-design-patterns/');
  });
});
