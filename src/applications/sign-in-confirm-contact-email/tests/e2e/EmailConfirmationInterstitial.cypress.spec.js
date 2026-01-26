import {
  DEFAULT_TRANSACTION_ID,
  buildUpdateEmailResponse,
  buildTransactionStatusResponse,
} from '~/platform/mhv/tests/fixtures/confirm-email-transactions';

describe('Email Confirmation Interstitial', () => {
  const mockUser = (
    emailData = {
      id: 123,
      emailAddress: 'test@example.com',
      createdAt: '2023-01-01T12:00:00.000Z',
      updatedAt: '2023-01-01T12:00:00.000Z',
      confirmationDate: null,
    },
  ) => ({
    data: {
      id: '',
      type: 'users_scaffolds',
      attributes: {
        services: ['evss-claims', 'form-save-in-progress', 'form-prefill'],
        account: {
          accountUuid: 'test-uuid',
        },
        profile: {
          email: 'test@example.com',
          firstName: 'Test',
          middleName: '',
          lastName: 'User',
          birthDate: '1990-01-01',
          gender: 'M',
          zip: '12345',
          lastSignedIn: '2023-01-01T12:00:00.000Z',
          loa: {
            current: 3,
            highest: 3,
          },
          multifactor: true,
          verified: true,
          signIn: {
            serviceName: 'idme',
          },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19900101',
          familyName: 'User',
          gender: 'M',
          givenNames: ['Test'],
          isCernerPatient: false,
          facilities: [],
          vaPatient: true,
          mhvAccountState: 'OK',
        },
        veteranStatus: {
          status: 'OK',
          isVeteran: true,
        },
        inProgressForms: [],
        prefillsAvailable: [],
        vet360ContactInformation: {
          email: emailData,
        },
      },
    },
  });

  beforeEach(() => {
    // Mock user endpoint
    cy.intercept('GET', '/v0/user', {
      statusCode: 200,
      body: mockUser(),
    }).as('getUser');

    // Mock feature toggles
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [],
        },
      },
    }).as('getFeatureToggles');

    // Mock maintenance windows endpoint
    cy.intercept('GET', '/v0/maintenance_windows*', {
      statusCode: 200,
      body: {
        data: [],
      },
    }).as('getMaintenanceWindows');
  });

  afterEach(() => {
    cy.window().then(win => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });

  it('Confirm your contact email', () => {
    // Mock successful API response for email confirmation (returns pending transaction)
    cy.intercept(
      'PUT',
      '**/profile/email_addresses',
      buildUpdateEmailResponse('RECEIVED'),
    ).as('confirmEmail');

    // Mock the polling endpoint to return success
    cy.intercept(
      'GET',
      `/v0/profile/status/${DEFAULT_TRANSACTION_ID}`,
      buildTransactionStatusResponse('COMPLETED_SUCCESS'),
    ).as('pollStatus');

    cy.visit('/sign-in-confirm-contact-email', {
      onBeforeLoad(win) {
        win.localStorage.setItem('hasSession', 'true');
        win.sessionStorage.setItem('authReturnUrl', '/my-va');
      },
    });

    cy.get('h1').should('contain', 'Confirm your contact email');

    cy.injectAxeThenAxeCheck();

    cy.title().should('include', 'Confirm your contact email address');

    cy.get('va-card').within(() => {
      cy.get('h2').should('contain', 'Contact email address');
      cy.contains(
        'We’ll send notifications about your VA health care and benefits to this email.',
      );
      cy.contains('test@example.com');
    });

    cy.findByTestId('sign-in--confirm-email-button')
      .should('exist')
      .should('have.attr', 'text', 'Confirm');

    cy.get('.update-button')
      .should('exist')
      .should('have.attr', 'text', 'Update email in profile');

    cy.get('va-link')
      .should('have.attr', 'text', 'Skip for now and go to VA.gov')
      .should('have.attr', 'href', '/my-va');

    cy.findByTestId('sign-in--confirm-email-button').click();

    // Wait for API call and polling
    cy.wait('@confirmEmail')
      .its('request.body')
      .should('deep.include', {
        id: 123,
        // eslint-disable-next-line camelcase
        email_address: 'test@example.com',
      });
    cy.wait('@pollStatus');

    // Verify success message
    cy.contains('Thank you for confirming your contact email address').should(
      'be.visible',
    );
    cy.injectAxeThenAxeCheck();

    cy.get('va-link-action')
      .should('have.attr', 'text', 'Continue to VA.gov')
      .should('have.attr', 'href', '/my-va');

    // Verify Confirm button is no longer visible after success
    cy.findByTestId('sign-in--confirm-email-button').should('not.exist');
  });

  it('displays error when confirmation fails', () => {
    // Mock failed API response
    cy.intercept('PUT', '**/profile/email_addresses', {
      statusCode: 500,
      body: {
        errors: [
          {
            title: 'Internal Server Error',
            detail: 'Failed to update email',
          },
        ],
      },
    }).as('confirmEmailError');

    cy.visit('/sign-in-confirm-contact-email', {
      onBeforeLoad(win) {
        win.localStorage.setItem('hasSession', 'true');
        win.sessionStorage.setItem('authReturnUrl', '/my-va');
      },
    });

    cy.get('h1').should('contain', 'Confirm your contact email');

    cy.injectAxeThenAxeCheck();

    cy.findByTestId('sign-in--confirm-email-button').click();

    // Wait for API call
    cy.wait('@confirmEmailError');

    // Verify error message
    cy.contains('We couldn’t confirm your contact email').should('be.visible');
    cy.injectAxeThenAxeCheck();

    // Verify Confirm button is visible
    cy.findByTestId('sign-in--confirm-email-button').should('exist');
  });

  it('redirects to home when no session exists', () => {
    cy.visit('/sign-in-confirm-contact-email');
    cy.injectAxeThenAxeCheck();

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('displays "Add email in profile" button when no email is provided', () => {
    // Mock user w/ no email
    cy.intercept('GET', '/v0/user', {
      statusCode: 200,
      body: mockUser(null),
    }).as('getUserNoEmail');

    cy.visit('/sign-in-confirm-contact-email', {
      onBeforeLoad(win) {
        win.localStorage.setItem('hasSession', 'true');
        win.sessionStorage.setItem('authReturnUrl', '/my-va');
      },
    });

    cy.get('h1').should('contain', 'Confirm your contact email');

    cy.injectAxeThenAxeCheck();

    // Verify No email message
    cy.contains('No email provided').should('be.visible');

    // Verify Add email button
    cy.get('va-link-action')
      .should('have.attr', 'text', 'Add email in profile')
      .should('have.attr', 'href', '/profile/contact-information');

    // Verify Confirm button is not present
    cy.findByTestId('sign-in--confirm-email-button').should('not.exist');
  });

  it('navigates to profile when "Update email in profile" is clicked', () => {
    cy.visit('/sign-in-confirm-contact-email', {
      onBeforeLoad(win) {
        win.localStorage.setItem('hasSession', 'true');
        win.sessionStorage.setItem('authReturnUrl', '/my-va');
      },
    });

    cy.get('h1').should('contain', 'Confirm your contact email');

    cy.injectAxeThenAxeCheck();

    // Verify Update button exists and navigates to profile
    cy.get('.update-button')
      .should('exist')
      .should('have.attr', 'text', 'Update email in profile');
  });
});
