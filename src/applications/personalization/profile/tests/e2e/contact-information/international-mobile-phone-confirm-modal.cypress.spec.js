import { PROFILE_PATHS } from '@@profile/constants';
import user36 from '@@profile/tests/fixtures/users/user-36.json';
import user36IntlMobile from '@@profile/tests/fixtures/users/user-36-international-mobile-phone.json';
import { mockFeatureToggles, mockGETEndpoints } from '../helpers';

describe('International mobile phone number confirm modal', () => {
  it('user sees the confirmation modal and confirms the update', () => {
    cy.viewportPreset('va-top-mobile-1');

    cy.login(user36);

    // Mock the intl mobile phone update transaction and follow-up requests

    cy.intercept('PUT', '/v0/profile/telephones', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_telephone_transactions',
          attributes: {
            transactionId: '06880455-a2e2-4379-95ba-90aa53fdb273',
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
            metadata: [],
          },
        },
      },
    });

    cy.intercept(
      'GET',
      '/v0/profile/status/06880455-a2e2-4379-95ba-90aa53fdb273',
      {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'async_transaction_va_profile_mock_transactions',
            attributes: {
              transactionId: '06880455-a2e2-4379-95ba-90aa53fdb273',
              transactionStatus: 'COMPLETED_SUCCESS',
              type: 'AsyncTransaction::VAProfile::MockTransaction',
              metadata: [],
            },
          },
        },
      },
    );

    cy.intercept('GET', '/v0/user?*', {
      statusCode: 200,
      body: user36IntlMobile,
    });

    mockGETEndpoints([
      'v0/mhv_account',
      'v0/profile/full_name',
      'v0/profile/status',
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/profile/direct_deposits',
    ]);

    // Enable the intl feature
    mockFeatureToggles(() => ({
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'profile_international_phone_numbers',
            value: true,
          },
          {
            name: 'profileInternationalPhoneNumbers',
            value: true,
          },
        ],
      },
    }));

    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

    cy.get('va-loading-indicator').should('not.exist');

    // Edit the mobile phone number

    cy.get('#edit-mobile-phone-number').click();

    cy.get('va-telephone-input[label="Mobile phone number"]').should('exist');
    cy.get('va-telephone-input[label="Mobile phone number"]').scrollIntoView();

    cy.get('va-combo-box').should('exist');

    // Interact with the country code combobox dropdown and number input

    cy.get('button.usa-combo-box__toggle-list').click();

    cy.get('li[data-value="AF"]').click({ force: true });

    cy.get('va-combo-box')
      .next()
      .shadow()
      .get('#inputField')
      .type('201234567');

    // Trigger save
    cy.findByTestId('save-edit-button').click();

    // Proceed through the confirmation modal
    cy.findByTestId('confirm-international-mobile-save-modal').should('exist');
    cy.contains('button', 'Save the number you entered').click();

    // Update was good
    cy.get('va-alert[status="success"]').should('exist');
  });
});
