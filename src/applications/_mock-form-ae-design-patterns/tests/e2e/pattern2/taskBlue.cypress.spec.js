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

  // it('should show user as authenticated from the start', () => {
  //   cy.visit(`${manifest.rootUrl}/2`);

  //   cy.injectAxeThenAxeCheck();

  //   cy.findByRole('button', { name: /blue/i }).click();

  //   cy.url().should('contain', '/introduction?loggedIn=true');

  //   cy.injectAxeThenAxeCheck();

  //   cy.findByText('Request a Board Appeal').should('exist');

  //   cy.findAllByRole('link', {
  //     name: /Start the Board Appeal request/i,
  //   })
  //     .first()
  //     .click();

  //   cy.wait('@mockSip');

  //   cy.url().should('contain', '/personal-information');

  //   cy.findByRole('button', { name: /continue/i }).click();

  //   cy.url().should('contain', '/veteran-information');
  // });

  // it('should successfully show prefill data on the form and allow updating mailing address', () => {
  //   // cy.visit(`${manifest.rootUrl}/2/task-blue/veteran-information`);
  //   cy.visit(`${manifest.rootUrl}/2/task-blue/introduction?loggedIn=true`);

  //   cy.injectAxeThenAxeCheck();

  //   // there are two buttons with the same text, so we need to find the first one
  //   cy.findAllByRole('link', {
  //     name: /Start the Board Appeal request/i,
  //   })
  //     .first()
  //     .click();

  //   cy.wait('@mockSip');

  //   cy.url().should('contain', '/personal-information');

  //   cy.findByRole('button', { name: /continue/i }).click();

  //   // check prefilled contact info page
  //   cy.url().should('contain', '/veteran-information');

  //   cy.findByText('Mobile phone number (optional)').should('exist');
  //   cy.get('va-telephone[contact="5554044567"]').should('exist');

  //   cy.findByText('Email address (optional)').should('exist');
  //   cy.findByText('Mitchell.Jenkins.Test@gmail.com').should('exist');

  //   cy.findByText('Mailing address').should('exist');
  //   cy.findByText('125 Main St.').should('exist');
  //   cy.findByText('Fulton, NY 97063').should('exist');

  //   cy.injectAxeThenAxeCheck();

  //   cy.get('va-link[label="Edit mailing address"]').click();
  //   // update mailing address and save form
  //   // cy.findByLabelText('Edit mailing address').click();

  //   // need this to access the input in the web component shadow dom
  //   cy.get('va-text-input[name="root_addressLine1"]')
  //     .shadow()
  //     .find('input')
  //     .as('addressInput');

  //   cy.get('@addressInput').clear();
  //   cy.get('@addressInput').type('345 Mailing Address St.');

  //   cy.findByLabelText('Yes, also update my profile').click();

  //   cy.findByTestId('save-edit-button').click();

  //   cy.wait('@mockUserUpdated'); // Make sure this intercept matches the actual API call.

  //   // redirect to previous page and show save alert
  //   cy.url().should('contain', '/veteran-information');
  //   cy.findByText('Mailing address updated').should('exist');
  //   cy.findByText('Mailing address').should('exist');
  //   cy.get('div[data-dd-action-name="street"]').should(
  //     'have.text',
  //     '345 Mailing Address St.',
  //   );

  //   // once the task is complete it should redirect to the pattern landing page
  //   cy.findByRole('button', { name: /Continue/i }).click();
  //   cy.url().should('contain', 'mock-form-ae-design-patterns/');
  // });

  // it('shows error alert when profile update fails but form data is saved', () => {
  //   // Set up simple intercepts
  //   cy.intercept('POST', '/v0/profile/address_validation').as('addressValidation');

  //   // Force the profile update to fail with a 500 error
  //   cy.intercept('PUT', '/v0/profile/addresses', {
  //     statusCode: 500,
  //     body: {
  //       errors: [
  //         {
  //           title: 'Server Error',
  //           detail: 'Profile update failed',
  //           code: '500',
  //           status: '500',
  //         },
  //       ],
  //     }
  //   }).as('updateProfileFail');

  //   // Allow form save to succeed normally
  //   cy.intercept('PUT', '/v0/in_progress_forms/*').as('saveForm');

  //   // Visit the page
  //   cy.visit(`${manifest.rootUrl}/2/task-blue/veteran-information`);

  //   // Click to edit mailing address
  //   cy.get('va-link[label="Edit mailing address"]').click();

  //   // Verify we're on the edit page
  //   cy.url().should('contain', '/edit-mailing-address');

  //   // Update the address
  //   cy.get('va-text-input[name="root_addressLine1"]')
  //     .shadow()
  //     .find('input')
  //     .clear()
  //     .type('11 Spooner St');

  //   // Select profile update option
  //   cy.findByLabelText('Yes, also update my profile').check();

  //   // Click save
  //   cy.findByTestId('save-edit-button').click();

  //   // Wait for key network requests
  //   cy.wait('@addressValidation');
  //   cy.wait('@updateProfileFail');

  //   // Verify we return to the veteran information page
  //   cy.url().should('include', '/veteran-information');

  //   cy.findByText('Mailing address updated').should('exist');

  //   // Look for any error text without complex assertions
  //   // cy.get('body').should('contain.text', 'couldn\'t update');
  // });
});

// describe('Prefill pattern - Blue Task Failure Scenario', () => {
//   it('shows error alert when profile update fails but form data is saved', () => {
//     // Setup necessary mocks without relying on beforeEach
//     cy.login(mockUsers.loa3User);

//     // Mock prefill data
//     cy.intercept('/v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS', {
//       statusCode: 200,
//       body: mockPrefills.prefill,
//     });

//     // Set up feature toggles
//     cy.intercept(
//       'GET',
//       '/v0/feature_toggles*',
//       generateFeatureToggles({
//         aedpPrefill: true,
//       })
//     );

//     // Mock address validation - this happens when the user clicks save
//     cy.intercept('POST', '/v0/profile/address_validation', {
//       statusCode: 200,
//       body: {
//         addresses: [
//           {
//             address: {
//               addressLine1: '11 Spooner St',
//               addressType: 'DOMESTIC',
//               city: 'Fulton',
//               countryCodeIso3: 'USA',
//               stateCode: 'NY',
//               zipCode: '97063',
//               addressPou: 'CORRESPONDENCE',
//             },
//             addressMetaData: {
//               confidenceScore: 100,
//               addressType: 'Domestic',
//               deliveryPointValidation: 'CONFIRMED',
//               residentialDeliveryIndicator: 'RESIDENTIAL',
//             },
//           },
//         ],
//         validationKey: -1565212962,
//       },
//     }).as('addressValidation');

//     // Force the profile update to fail with a 500 error
//     cy.intercept('PUT', '/v0/profile/addresses', {
//       statusCode: 500,
//       body: {
//         errors: [
//           {
//             title: 'Server Error',
//             detail: 'Profile update failed',
//             code: '500',
//             status: '500',
//           },
//         ],
//       }
//     }).as('updateProfileFail');

//     // Allow form save to succeed
//     cy.intercept('PUT', '/v0/in_progress_forms/*', {
//       statusCode: 200,
//       body: {
//         data: {
//           id: '',
//           type: 'in_progress_forms',
//           attributes: {
//             formId: 'FORM-MOCK-AE-DESIGN-PATTERNS',
//             createdAt: '2025-01-01T00:00:00.000Z',
//             updatedAt: '2025-01-01T00:00:00.000Z',
//             metadata: {
//               version: 0,
//             },
//           },
//         },
//       }
//     }).as('saveForm');

//     // Skip the transaction status check - if app is checking for it,
//     // make it return an error
//     cy.intercept('GET', '/v0/profile/status/*', {
//       statusCode: 500,
//       body: { errors: [{ title: 'Transaction status error', detail: 'Failed to retrieve transaction status' }] }
//     });

//     // Visit the page directly
//     cy.visit(`${manifest.rootUrl}/2/task-blue/veteran-information`);

//     // Click to edit mailing address
//     cy.get('va-link[label="Edit mailing address"]').click();

//     // Verify we're on the edit page
//     cy.url().should('contain', '/edit-mailing-address');

//     // Update the address
//     cy.get('va-text-input[name="root_addressLine1"]')
//       .shadow()
//       .find('input')
//       .clear()
//       .type('11 Spooner St');

//     // Select profile update option
//     cy.findByLabelText('Yes, also update my profile').check();

//     // Click save
//     cy.findByTestId('save-edit-button').click();

//     // Now check if we see an error message
//     cy.contains("We couldn't update your VA.gov profile", {timeout: 10000});
//   });
// });

describe('Debugging Address Validation and Profile Update', () => {
  it('verifies the address validation flow works', () => {
    // Login the user (essential)
    cy.login(mockUsers.loa3User);

    // Prefill data - this is critical
    cy.intercept('/v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS', {
      statusCode: 200,
      body: mockPrefills.prefill,
    }).as('mockSip');

    // Set up feature toggles
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        aedpPrefill: true,
      }),
    );

    // Copy the critical transaction setup from beforeEach
    cy.intercept(
      'GET',
      '/v0/user?now=*',
      mockUsers.loa3UserWithUpdatedMailingAddress,
    );

    // Set up spies for the validation flow
    cy.intercept('POST', '/v0/profile/address_validation*').as(
      'addressValidation',
    );
    cy.intercept('PUT', '/v0/profile/addresses*').as('profileUpdate');
    cy.intercept('PUT', '/v0/in_progress_forms*').as('formSave');
    cy.intercept('GET', '/v0/profile/status*').as('transactionStatus');

    // Visit directly to the veteran information page
    cy.visit(`${manifest.rootUrl}/2/task-blue/veteran-information`);

    cy.injectAxeThenAxeCheck();

    // Wait for prefill to complete
    cy.wait('@mockSip');

    // Verify page loaded properly
    cy.get('va-link[label="Edit mailing address"]').should('be.visible');

    // Click to edit mailing address
    cy.get('va-link[label="Edit mailing address"]').click();

    // Ensure we're on edit page
    cy.url().should('contain', '/edit-mailing-address');

    // Update address (simple change)
    // cy.get('va-text-input[name="root_addressLine1"]')
    //   .shadow()
    //   .find('input')
    //   .should('be.visible')
    //   .clear()
    //   .type('11 Spooner St');

    cy.get('va-text-input[name="root_addressLine1"]')
      .shadow()
      .find('input')
      .as('addressInput');

    cy.get('@addressInput').clear();
    cy.get('@addressInput').type('11 Spooner St');

    // Select update profile option
    cy.findByLabelText('Yes, also update my profile').check();

    // Click update - this is where it hangs
    cy.findByTestId('save-edit-button').click();

    // Wait for ANY address validation request (even if it fails)
    cy.wait('@addressValidation').then(interception => {
      // Log what happened with address validation
      cy.log(
        `Address validation response status: ${
          interception.response?.statusCode
        }`,
      );
    });

    cy.findByTestId('confirm-address-button').click();

    // See if we progressed to the profile update step
    cy.wait('@profileUpdate').then(interception => {
      cy.log(
        `Profile update response status: ${interception.response?.statusCode}`,
      );
    });

    // Check if we go back to veteran-information page
    cy.url().should('include', '/veteran-information');
    cy.findByText(
      'We couldn’t update your VA.gov profile, but your changes were saved to this form',
    ).should('exist');
    cy.get('div[data-dd-action-name="street"]').should(
      'have.text',
      '11 Spooner St',
    );
  });
});
