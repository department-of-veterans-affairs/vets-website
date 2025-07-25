import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = (mobile = false) => {
  if (mobile) {
    cy.viewportPreset('va-top-mobile-1');
  }

  cy.login(mockUser);

  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/ppiu/payment_information',
  ]);

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

  cy.get('body').then($body => {
    if ($body.find('va-loading-indicator').length) {
      cy.get('va-loading-indicator')
        .should('exist')
        .then($container => {
          cy.wrap($container)
            .shadow()
            .findByRole('progressbar')
            .should('contain', /loading your information/i);
        });
      cy.get('va-loading-indicator').should('not.exist');
    }
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

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: mockUser,
  });
};

const editPhoneNumber = (label = 'Edit Home phone number') => {
  cy.get(`va-button[label="${label}"]`).click({ force: true });
};

const fillPhoneNumber = ({ country = null, phone, extension }) => {
  if (country) {
    cy.get('va-telephone-input')
      .should('exist')
      .shadow()
      .find('va-combo-box')
      .shadow()
      .find('input')
      .clear()
      .type(country, { force: true });
  }

  cy.get('va-telephone-input')
    .shadow()
    .find('va-text-input')
    .shadow()
    .find('input')
    .clear()
    .then($input => {
      if (phone) {
        cy.wrap($input).type(phone, { force: true });
      }
    });

  // Always clear the extension field, then type if extension is provided
  cy.get('va-text-input[label="Extension (6 digits maximum)"]')
    .shadow()
    .find('input')
    .clear()
    .then($input => {
      if (extension) {
        cy.wrap($input).type(extension, { force: true });
      }
    });
};

const savePhoneNumber = () => {
  cy.findByTestId('save-edit-button')
    .shadow()
    .find('button')
    .click({ force: true });
};

const assertSuccess = () => {
  cy.contains('Update saved.').should('exist');
};

describe('The contact information phone number editing', () => {
  it('should allow editing a domestic phone number', () => {
    setup(false);
    editPhoneNumber('Edit Home phone number');
    fillPhoneNumber({ phone: '555-123-4567', extension: '321' });
    savePhoneNumber();
    assertSuccess();
    cy.injectAxeThenAxeCheck();
  });

  it('should allow editing an international phone number', () => {
    setup(true);
    editPhoneNumber('Edit Home phone number');
    fillPhoneNumber({ country: 'United Kingdom', phone: '20 7946 0958' });
    savePhoneNumber();
    assertSuccess();
    cy.injectAxeThenAxeCheck();
  });

  it('should allow editing an international phone number on mobile', () => {
    setup(true);
    editPhoneNumber('Edit Home phone number');
    fillPhoneNumber({ country: 'France', phone: '01 23 45 67 89' });
    savePhoneNumber();
    assertSuccess();
    cy.injectAxeThenAxeCheck();
  });
});
