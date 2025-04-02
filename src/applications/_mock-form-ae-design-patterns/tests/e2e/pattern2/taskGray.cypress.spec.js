import manifest from '../../../manifest.json';
import mockUsers from '../../../mocks/endpoints/user';
import mockPrefills from '../../../mocks/endpoints/in-progress-forms/mock-form-ae-design-patterns';

describe('Prefill pattern - Gray Task', () => {
  beforeEach(() => {
    cy.login(mockUsers.loa3User);

    cy.intercept('/v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS', {
      statusCode: 200,
      body: mockPrefills.prefill,
    }).as('mockSip');

    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'profile_use_experimental', value: true },
          { name: 'coe_access', value: true },
        ],
      },
    }).as('mockFeatureToggles');

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
  });

  it('should show user as authenticated from the start', () => {
    cy.visit(`${manifest.rootUrl}/2`);

    cy.injectAxeThenAxeCheck();

    cy.findByRole('button', { name: /gray/i }).click();

    cy.url().should('contain', '/introduction?loggedIn=true');

    cy.injectAxeThenAxeCheck();

    cy.findByText(
      'Request a VA home loan Certificate of Eligibility (COE)',
    ).should('exist');

    cy.get('a.vads-c-action-link--green')
      .contains('Request a Certificate of Eligibility')
      .first()
      .click();

    // cy.wait('@mockSip');

    cy.url().should('contain', '/applicant-information');

    cy.findByRole('button', { name: /continue/i }).click();

    // cy.wait('@mockSip');

    cy.url().should('contain', '/veteran-information');
  });

  it('should successfully show prefill data on the form and allow updating mailing address', () => {
    // cy.visit(`${manifest.rootUrl}/2/task-blue/veteran-information`);
    cy.visit(`${manifest.rootUrl}/2/task-gray/introduction?loggedIn=true`);

    cy.injectAxeThenAxeCheck();

    cy.get('a.vads-c-action-link--green')
      .contains('Request a Certificate of Eligibility')
      .first()
      .click();

    // cy.wait('@mockSip');

    cy.url().should('contain', '/applicant-information');

    cy.findByRole('button', { name: /continue/i }).click();

    // cy.wait('@mockSip');

    // check prefilled contact info page
    cy.url().should('contain', '/veteran-information');
    cy.findByText('Mailing address').should('exist');
    cy.findByText('125 Main St.').should('exist');
    cy.findByText('Fulton, NY 97063').should('exist');

    cy.injectAxeThenAxeCheck();

    // update mailing address and save form
    cy.findByLabelText('Edit mailing address').click();

    // need this to access the input in the web component shadow dom
    cy.get('va-text-input[name="root_addressLine1"]')
      .shadow()
      .find('input')
      .as('addressInput');

    cy.get('@addressInput').clear();
    cy.get('@addressInput').type('345 Mailing Address St.');

    cy.findByTestId('save-edit-button').click();

    cy.wait('@mockUserUpdated');

    // redirect to previous page and show save alert
    cy.url().should('contain', '/veteran-information');
    cy.findByText('We’ve updated your mailing address').should('exist');
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
    cy.url().should('contain', '/review-then-submit');
  });
});
