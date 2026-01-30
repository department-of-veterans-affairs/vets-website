import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = () => {
  cy.viewportPreset('va-top-mobile-1');

  cy.login(mockUser);

  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/direct_deposits',
  ]);

  // This test covers the international phones flag ON scenario using the va-telephone-input component
  // Legacy scenarios (flag OFF) are covered in ContactInformation.edit-telephone.unit.spec.jsx
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

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: mockUser,
  });

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

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
};

const editPhoneNumber = (
  numberName,
  { country, phoneNumber, extension } = {},
) => {
  cy.get(`va-button[label="Edit ${numberName}"]`).click({ force: true });

  // Update country picker
  // Country defaults to US, so only clear/fill if it's provided
  if (country) {
    cy.get('va-telephone-input')
      .should('exist')
      .shadow()
      .find('va-combo-box')
      .shadow()
      .find('input')
      .clear();
    cy.get('va-telephone-input')
      .should('exist')
      .shadow()
      .find('va-combo-box')
      .shadow()
      .find('input')
      .should('not.be.disabled')
      .type(country, { force: true });
  }

  // Edit phone number input
  cy.get('va-telephone-input')
    .shadow()
    .find('va-text-input')
    .shadow()
    .find('input')
    .clear();
  if (phoneNumber) {
    cy.get('va-telephone-input')
      .shadow()
      .find('va-text-input')
      .shadow()
      .find('input')
      .should('not.be.disabled')
      .type(phoneNumber, { force: true });
  }

  // Always clear the extension field if present (home and work numbers only)
  if (numberName !== 'Mobile phone number') {
    cy.get('va-text-input[label="Extension (6 digits maximum)"]')
      .shadow()
      .find('input')
      .clear();
    if (extension) {
      cy.get('va-text-input[label="Extension (6 digits maximum)"]')
        .shadow()
        .find('input')
        .should('not.be.disabled')
        .type(extension, { force: true });
    }
  }

  cy.findByTestId('save-edit-button')
    .shadow()
    .find('button')
    .click({ force: true });
};

describe('Profile - Contact Information - editing phone numbers', () => {
  it('should allow updating a domestic phone number', () => {
    setup();
    editPhoneNumber('Home phone number', {
      phoneNumber: '(555) 123-4567',
      extension: '321',
    });
    cy.contains('Update saved').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should allow updating an international phone number', () => {
    setup();
    editPhoneNumber('Work phone number', {
      country: 'France',
      phoneNumber: '01 23 45 67 89',
    });
    cy.contains('Update saved').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should allow updating an international mobile phone number', () => {
    setup();
    editPhoneNumber('Mobile phone number', {
      country: 'United Kingdom',
      phoneNumber: '20 7946 0958',
    });

    // We can't send texts to international numbers, so we display a warning
    // message in a confirm/cancel modal and click to confirm
    cy.get('va-modal')
      .should('exist')
      .shadow()
      .find('va-button')
      .first()
      .click();

    cy.contains('Update saved').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should prevent saving an invalid phone number', () => {
    setup();
    editPhoneNumber('Home phone number', {
      phoneNumber: '(555) 123-4567 8', // Invalid US number
    });

    cy.get('va-telephone-input').should(
      'have.attr',
      'error',
      'Enter a valid United States of America phone number. Use 10 digits.',
    );

    cy.contains('Update saved').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
