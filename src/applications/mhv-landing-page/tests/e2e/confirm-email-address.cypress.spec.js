import { rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

const buildUpdateEmailResponse = (isSuccess = true) => ({
  statusCode: isSuccess ? 200 : 400,
  body: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_address_transactions',
      attributes: {
        transactionId: 'email_address_tx_id',
        transactionStatus: isSuccess ? 'RECEIVED' : 'COMPLETED_FAILURE',
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
});

describe('MHV Email Confirmation Alert - Confirm Email', () => {
  beforeEach(() => {
    cy.clearCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE);
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();

    const userWithEmail = { ...user };
    userWithEmail.data.attributes.vet360ContactInformation.email = {
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
        req.reply(buildUpdateEmailResponse(false));
      } else {
        req.reply(buildUpdateEmailResponse());
      }
    }).as('updateEmail');

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');

    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    LandingPage.clickErrorConfirmEmail();
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
      buildUpdateEmailResponse(false),
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
      buildUpdateEmailResponse(),
    ).as('updateEmail');

    LandingPage.clickConfirmEmail();
    cy.wait('@updateEmail');

    // Verify success alert is shown and cookie is set.
    cy.findByTestId('mhv-alert--confirm-contact-email').should('not.exist');
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should redirect to the contact information page with email address hash when edit is clicked', () => {
    LandingPage.clickEditEmailLink();

    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#email-address');

    cy.injectAxeThenAxeCheck();
  });
});
