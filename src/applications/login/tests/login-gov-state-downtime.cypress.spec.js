describe('Login.gov State Downtime Alert', () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
  });

  it('should not display alert when feature flag is disabled', () => {
    cy.intercept('GET', '/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'login_gov_state_downtime_alerts',
              value: false,
            },
          ],
        },
      },
    });

    cy.visit('/sign-in/?oauth=false');
    cy.get('body').should('be.visible');
    cy.get('.state-downtime-notification').should('not.exist');
  });

  it('should display alert when user state is affected by incident', () => {
    // Mock feature flag as enabled
    cy.intercept('GET', '/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'login_gov_state_downtime_alerts',
              value: true,
            },
          ],
        },
      },
    });

    // Mock user with Arkansas address
    cy.intercept('GET', '/v0/user*', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            profile: {
              vapContactInfo: {
                residentialAddress: {
                  addressLine1: '123 Main St',
                  city: 'Little Rock',
                  stateCode: 'AR',
                  zipCode: '72201',
                  countryCodeIso3: 'USA',
                },
              },
            },
          },
        },
      },
    });

    // Mock login.gov state incidents - Arkansas is affected
    cy.intercept('GET', '/login_gov_state_incidents', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            incidents: [
              {
                id: '123',
                active: true,
                states: ['AR', 'TX'],
                title: 'Login.gov maintenance in Arkansas and Texas',
                message:
                  'Login.gov is currently experiencing scheduled maintenance affecting users in Arkansas and Texas. You may have trouble signing in with your Login.gov account. Please try again later or use an alternate sign-in method.',
                status: 'warning',
              },
            ],
          },
        },
      },
    });

    cy.visit('/sign-in/?oauth=false');
    cy.get('body').should('be.visible');

    // Verify the alert is displayed
    cy.get('.state-downtime-notification').should('exist');
    cy.get('.state-downtime-notification va-alert').should('be.visible');
    cy.get('.state-downtime-notification va-alert').should(
      'have.attr',
      'status',
      'warning',
    );
    cy.get('.state-downtime-notification h2').should(
      'contain',
      'Login.gov maintenance in Arkansas and Texas',
    );
    cy.get('.state-downtime-notification va-alert').should(
      'contain',
      'Please try again later or use an alternate sign-in method',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('should not display alert when user state is not affected', () => {
    // Mock feature flag as enabled
    cy.intercept('GET', '/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'login_gov_state_downtime_alerts',
              value: true,
            },
          ],
        },
      },
    });

    // Mock user with California address
    cy.intercept('GET', '/v0/user*', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            profile: {
              vapContactInfo: {
                residentialAddress: {
                  addressLine1: '456 Oak Ave',
                  city: 'San Francisco',
                  stateCode: 'CA',
                  zipCode: '94102',
                  countryCodeIso3: 'USA',
                },
              },
            },
          },
        },
      },
    });

    // Mock login.gov state incidents - only Arkansas is affected
    cy.intercept('GET', '/login_gov_state_incidents', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            incidents: [
              {
                id: '123',
                active: true,
                states: ['AR'],
                title: 'Login.gov maintenance in Arkansas',
                message: 'Down in Arkansas',
                status: 'warning',
              },
            ],
          },
        },
      },
    });

    cy.visit('/sign-in/?oauth=false');
    cy.get('body').should('be.visible');

    // Verify the alert is NOT displayed
    cy.get('.state-downtime-notification').should('not.exist');
  });

  it('should gracefully handle API errors', () => {
    // Mock feature flag as enabled
    cy.intercept('GET', '/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'login_gov_state_downtime_alerts',
              value: true,
            },
          ],
        },
      },
    });

    // Mock API error
    cy.intercept('GET', '/login_gov_state_incidents', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    });

    cy.visit('/sign-in/?oauth=false');
    cy.get('body').should('be.visible');

    // Verify the alert is NOT displayed on error (graceful degradation)
    cy.get('.state-downtime-notification').should('not.exist');

    // Page should still be functional
    cy.get('H1').contains('Sign in or create an account');
  });

  it('should not display alert for inactive incidents', () => {
    // Mock feature flag as enabled
    cy.intercept('GET', '/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'login_gov_state_downtime_alerts',
              value: true,
            },
          ],
        },
      },
    });

    // Mock user with Arkansas address
    cy.intercept('GET', '/v0/user*', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            profile: {
              vapContactInfo: {
                residentialAddress: {
                  stateCode: 'AR',
                },
              },
            },
          },
        },
      },
    });

    // Mock login.gov state incidents - incident is resolved (inactive)
    cy.intercept('GET', '/login_gov_state_incidents', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            incidents: [
              {
                id: '123',
                active: false, // Incident is inactive
                states: ['AR'],
                title: 'Resolved maintenance',
                message: 'Maintenance is complete',
              },
            ],
          },
        },
      },
    });

    cy.visit('/sign-in/?oauth=false');
    cy.get('body').should('be.visible');

    // Verify the alert is NOT displayed for inactive incidents
    cy.get('.state-downtime-notification').should('not.exist');
  });
});
