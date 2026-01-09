import {
  DEFAULT_TRANSACTION_ID,
  buildUpdateEmailResponse,
  buildTransactionStatusResponse,
} from '~/platform/mhv/tests/fixtures/confirm-email-transactions';

import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

describe('MHV Email Confirmation Alert - Confirm Email', () => {
  beforeEach(() => {
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();

    const userWithEmail = { ...user };
    userWithEmail.data.attributes.vet360ContactInformation.email = {
      id: 12345,
      emailAddress: 'user@test.com',
    };
    cy.login(userWithEmail);
    cy.visit(rootUrl);
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

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');

    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    LandingPage.clickErrorConfirmEmail();
    cy.wait('@updateEmail');
    cy.wait('@pollStatus');

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

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Verify error alert is shown and cookie isn't set.
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    // Click the edit link and verify redirection to contact info page.
    LandingPage.clickErrorEditEmailLink();
    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#email-address');

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

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');
    cy.wait('@pollStatus');

    // Verify success alert is shown and cookie is set.
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the error alert when transaction polling fails', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse('RECEIVED'),
    ).as('updateEmail');

    // Mock the polling endpoint to return failure
    cy.intercept(
      'GET',
      `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`,
      buildTransactionStatusResponse('COMPLETED_FAILURE'),
    ).as('pollStatus');

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');
    cy.wait('@pollStatus');

    // Verify error alert is shown and cookie is not set.
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should poll multiple times when transaction is pending before succeeding', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse('RECEIVED'),
    ).as('updateEmail');

    // Mock the polling endpoint to return RECEIVED (pending) first, then COMPLETED_SUCCESS
    let pollCount = 0;
    cy.intercept('GET', `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`, req => {
      pollCount += 1;
      if (pollCount < 3) {
        req.reply(buildTransactionStatusResponse('RECEIVED'));
      } else {
        req.reply(buildTransactionStatusResponse('COMPLETED_SUCCESS'));
      }
    }).as('pollStatus');

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Wait for multiple polls - the transaction should still be pending
    cy.wait('@pollStatus');
    cy.wait('@pollStatus');
    // Third poll should return success
    cy.wait('@pollStatus');

    // Verify success alert is shown after multiple polls
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    // Verify the poll endpoint was called at least 3 times
    cy.get('@pollStatus.all').should('have.length.at.least', 3);

    cy.injectAxeThenAxeCheck();
  });

  it('should redirect to the contact information page with email address hash when edit is clicked', () => {
    LandingPage.clickEditEmailLink();

    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#email-address');

    cy.injectAxeThenAxeCheck();
  });
});
