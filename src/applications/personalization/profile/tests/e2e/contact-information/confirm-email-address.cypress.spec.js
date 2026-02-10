import {
  DEFAULT_TRANSACTION_ID,
  buildUpdateEmailResponse,
  buildTransactionStatusResponse,
} from '~/platform/mhv/tests/fixtures/confirm-email-transactions';

import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';
import ContactInformationPage from './pages/ContactInformationPage';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

const setup = () => {
  cy.login(mockUser);

  mockFeatureToggles(() => ({
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhvEmailConfirmation',
          value: true,
        },
      ],
    },
  }));

  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/direct_deposits',
  ]);

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: mockUser,
  }).as('finalUserRequest');

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
  cy.wait('@mockUser');
};

describe('MHV Email Confirmation Alert - Confirm Email', () => {
  beforeEach(() => {
    setup();
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
  });

  it('should not show the error alert when the feature flag is disabled', () => {
    mockFeatureToggles(() => ({
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhvEmailConfirmation',
            value: false,
          },
        ],
      },
    }));

    cy.findByTestId('profile-alert--confirm-contact-email').should('not.exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the error alert when confirm fails and handle a successful retry attempt', () => {
    let hasFailed = false;
    cy.intercept('PUT', '/v0/profile/email_addresses', req => {
      if (!hasFailed) {
        hasFailed = true;
        req.reply(buildUpdateEmailResponse('COMPLETED_FAILURE'));
      } else {
        req.reply(buildUpdateEmailResponse('RECEIVED'));
      }
    }).as('updateEmail');

    // Mock the polling endpoint for successful retry
    cy.intercept(
      'GET',
      `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`,
      buildTransactionStatusResponse('COMPLETED_SUCCESS'),
    ).as('pollStatus');

    cy.findByTestId('profile-alert--confirm-contact-email').should(
      'be.visible',
    );
    cy.findByTestId('profile-alert--confirm-contact-email').findByRole(
      'heading',
      {
        level: 3,
        name: /Confirm your contact email/,
      },
    );
    ContactInformationPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Confirm error alert appears in edit view
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');

    // Verify the MHV email confirmation alert cookie was NOT set
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    ContactInformationPage.clickErrorConfirmEmail();
    cy.wait('@updateEmail');
    cy.wait('@pollStatus');

    // Confirm success alert shows after successful retry
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the error alert when confirm fails and handle clicking the edit button', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse('COMPLETED_FAILURE'),
    ).as('updateEmail');

    ContactInformationPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Confirm error alert appears in edit view
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');
    cy.findByTestId('mhv-alert--confirm-error').findByRole('heading', {
      level: 3,
      name: /We couldn’t confirm your contact email/,
    });

    // Verify the MHV email confirmation alert cookie was NOT set
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    // Click the edit button and verify the email address field is focused
    ContactInformationPage.clickErrorEditEmail();
    cy.get('va-text-input[name="root_emailAddress"]')
      .shadow()
      .find('input#inputField')
      .should('have.focus');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the success alert when confirm succeeds', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse('RECEIVED'),
    ).as('updateEmail');

    // Mock the polling endpoint
    cy.intercept(
      'GET',
      `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`,
      buildTransactionStatusResponse('COMPLETED_SUCCESS'),
    ).as('pollStatus');

    ContactInformationPage.clickConfirmEmail();
    cy.wait('@updateEmail');
    cy.wait('@pollStatus');

    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.findByTestId('mhv-alert--confirm-success').findByRole('heading', {
      level: 3,
      name: /Thank you for confirming your contact email address/,
    });
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should focus the email address field when edit button is clicked', () => {
    ContactInformationPage.clickEditEmail();

    cy.get('va-text-input[name="root_emailAddress"]')
      .shadow()
      .find('input#inputField')
      .should('have.focus');

    cy.injectAxeThenAxeCheck();
  });
});
