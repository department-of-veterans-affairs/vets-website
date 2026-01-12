import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';

describe('Loading', () => {
  beforeEach(() => {
    mockFeatureToggles();
    mockClaimsEndpoint();
    mockAppealsEndpoint();
    mockStemEndpoint();
  });

  it('should display required login view loader', () => {
    window.localStorage.setItem('hasSession', true);

    /* eslint-disable camelcase */
    cy.intercept('GET', '/v0/user', {
      delay: 500,
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'users_scaffolds',
          attributes: {
            account: {
              account_uuid: '123',
            },
            profile: {
              email: 'fake@fake.com',
              loa: { current: 3 },
              first_name: 'Jane',
              middle_name: '',
              last_name: 'Doe',
              gender: 'F',
              birth_date: '1985-01-01',
              verified: true,
            },
            veteran_status: {
              status: 'OK',
              is_veteran: true,
            },
            services: [
              'evss-claims',
              'form526',
              'lighthouse',
              'appeals-status',
            ],
            va_profile: {
              status: 'OK',
            },
          },
        },
        meta: { errors: null },
      },
    }).as('userRequest');
    /* eslint-enable camelcase */

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByTestId('required-login-view-loader').should('be.visible');

    cy.wait('@userRequest');

    cy.findByTestId('required-login-view-loader').should('not.exist');
    cy.findByRole('heading', {
      name: 'Check your claim, decision review, or appeal status',
    });

    cy.axeCheck();
  });

  it('should display downtime notification loader', () => {
    cy.intercept('GET', '/v0/maintenance_windows*', {
      delay: 1500,
      statusCode: 200,
      body: {
        data: [],
      },
    }).as('maintenanceWindowsRequest');

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByTestId('downtime-notification-loader').should('be.visible');

    cy.wait('@maintenanceWindowsRequest');

    cy.findByTestId('downtime-notification-loader').should('not.exist');
    cy.findByRole('heading', {
      name: 'Check your claim, decision review, or appeal status',
    });

    cy.axeCheck();
  });

  it('should display feature flags loader', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      delay: 1500,
      statusCode: 200,
      body: {
        data: {
          features: [],
        },
      },
    }).as('featureTogglesRequest');

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByTestId('feature-flags-loader').should('be.visible');

    cy.wait('@featureTogglesRequest');

    cy.findByTestId('feature-flags-loader').should('not.exist');
    cy.findByRole('heading', {
      name: 'Check your claim, decision review, or appeal status',
    });

    cy.axeCheck();
  });
});
