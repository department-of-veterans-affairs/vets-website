import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

const MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE =
  'MHV_EMAIL_CONFIRMATION_DISMISSED';

const clickConfirmEmail = () => {
  cy.get(
    'va-alert[data-testid="mhv-alert--confirm-contact-email"], va-alert[data-testid="mhv-alert--confirm-error"]',
  )
    .find('va-button[text="Confirm"]')
    .shadow()
    .find('button')
    .click();
};

const clickEditEmailLink = () => {
  cy.get(
    'va-alert[data-testid="mhv-alert--confirm-contact-email"], va-alert[data-testid="mhv-alert--confirm-error"]',
  )
    .find('va-link[href="/profile/contact-information#contact-email-address"]')
    .shadow()
    .find('a')
    .click();
};

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
        req.reply(buildUpdateEmailResponse(false));
      } else {
        req.reply(buildUpdateEmailResponse());
      }
    }).as('updateEmail');

    clickConfirmEmail();
    cy.wait('@updateEmail');

    cy.get('[data-testid="mhv-alert--confirm-contact-email"]').should(
      'not.exist',
    );
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');

    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    clickConfirmEmail();
    cy.wait('@updateEmail');

    cy.get('[data-testid="mhv-alert--confirm-contact-email"]').should(
      'not.exist',
    );
    cy.get('[data-testid="mhv-alert--confirm-error"]').should('not.exist');
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

    clickConfirmEmail();
    cy.wait('@updateEmail');

    // Verify error alert is shown and cookie isn't set.
    cy.get('[data-testid="mhv-alert--confirm-contact-email"]').should(
      'not.exist',
    );
    cy.findByTestId('mhv-alert--confirm-error').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-error').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('be.null');

    // Click the edit link and verify redirection to contact info page.
    clickEditEmailLink();
    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#contact-email-address');

    cy.injectAxeThenAxeCheck();
  });

  it('should show the success alert when confirm succeeds', () => {
    cy.intercept(
      'PUT',
      '/v0/profile/email_addresses',
      buildUpdateEmailResponse(),
    ).as('updateEmail');

    clickConfirmEmail();
    cy.wait('@updateEmail');

    // Verify success alert is shown and cookie is set.
    cy.get('[data-testid="mhv-alert--confirm-contact-email"]').should(
      'not.exist',
    );
    cy.findByTestId('mhv-alert--confirm-success').should('be.visible');
    cy.findByTestId('mhv-alert--confirm-success').should('be.focused');
    cy.getCookie(MHV_EMAIL_CONFIRMATION_DISMISSED_COOKIE).should('not.be.null');

    cy.injectAxeThenAxeCheck();
  });

  it('should redirect to the contact information page with email address hash when edit is clicked', () => {
    clickEditEmailLink();

    cy.url().should('include', '/profile/contact-information');
    cy.hash().should('equal', '#contact-email-address');

    cy.injectAxeThenAxeCheck();
  });
});
