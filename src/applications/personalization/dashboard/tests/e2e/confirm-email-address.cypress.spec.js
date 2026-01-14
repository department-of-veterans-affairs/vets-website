import {
  DEFAULT_TRANSACTION_ID,
  buildUpdateEmailResponse,
  buildTransactionStatusResponse,
} from '~/platform/mhv/tests/fixtures/confirm-email-transactions';

import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import DashboardPage from './pages/Dashboard';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

describe('MHV Email Confirmation Alert - Confirm Email', () => {
  beforeEach(() => {
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });
    cy.intercept('/v0/appeals', { data: [] });
    cy.intercept('/v0/benefits_claims', { data: [] });
    cy.intercept('/v0/debts*', { data: [] });
    cy.intercept('/v0/medical_copays', { data: [] });
    cy.intercept('/v0/my_va/submission_statuses', { data: [] });
    cy.intercept('/v0/onsite_notifications', { data: [] });
    cy.intercept('/vaos/v2/appointments*', { data: [] });
    cy.intercept('/v0/profile/service_history', serviceHistory).as('serviceB');
    cy.intercept('/v0/profile/full_name', fullName).as('nameB');
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: 'mhvEmailConfirmation',
            value: true,
          },
        ],
      },
    });
    mockLocalStorage();

    cy.login(mockUser);
    cy.visit('my-va/');
  });

  it('should show the error alert when confirm fails and handle a successful retry attempt', () => {
    let hasFailed = false;
    cy.intercept('PUT', '/v0/profile/email_addresses', req => {
      if (!hasFailed) {
        hasFailed = true;
        req.reply(buildUpdateEmailResponse('COMPLETED_FAILURE'));
      } else {
        req.reply(buildUpdateEmailResponse('COMPLETED_SUCCESS'));
      }
    }).as('updateEmail');

    // Mock successful polling for the retry
    cy.intercept(
      'GET',
      `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`,
      buildTransactionStatusResponse('COMPLETED_SUCCESS'),
    ).as('pollStatus');

    DashboardPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');

    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    DashboardPage.clickErrorConfirmEmail();
    cy.wait('@updateEmail');

    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the error alert when confirm fails and handle clicking the edit link', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse('COMPLETED_FAILURE'),
    ).as('updateEmail');

    DashboardPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Verify error alert is shown and cookie isn't set.
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    // Click the edit link and verify redirection to contact info page.
    DashboardPage.clickErrorEditEmailLink();
    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#email-address');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the success alert when confirm succeeds', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse('COMPLETED_SUCCESS'),
    ).as('updateEmail');

    cy.intercept(
      'GET',
      `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`,
      buildTransactionStatusResponse('COMPLETED_SUCCESS'),
    ).as('pollStatus');

    DashboardPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Verify success alert is shown and cookie is set.
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should redirect to the contact information page with email address hash when edit is clicked', () => {
    DashboardPage.clickEditEmailLink();

    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#email-address');

    cy.injectAxeThenAxeCheck();
  });
});
