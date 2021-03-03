import path from 'path';

describe('Facility search error messages', () => {
  before(function() {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/v0/feature_toggles?*', []);
    cy.route('GET', '/v0/maintenance_windows', []);
  });

  it('shows error message for location field', () => {
    cy.visit('/find-locations');

    cy.injectAxe();

    cy.get('#facility-type-dropdown').select('VA health');

    cy.axeCheck();

    cy.get('.usa-input-error-message').contains(
      'Please fill in a city, state, or postal code.',
    );
    cy.get('#street-city-state-zip').type('A');
    cy.get('.usa-input-error-message').should('not.exist');
  });

  it('shows error message for facility type field', () => {
    cy.visit('/find-locations');

    cy.injectAxe();

    cy.get('#street-city-state-zip').type('A');

    cy.axeCheck();

    cy.get('.usa-input-error-message').contains(
      'Please choose a facility type.',
    );
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('.usa-input-error-message').should('not.exist');
  });

  it('shows error message for service type field', () => {
    cy.visit('/find-locations');

    cy.injectAxe();

    cy.get('#street-city-state-zip').type('A');
    cy.get('#facility-type-dropdown').select(
      'Community providers (in VA’s network)',
    );

    cy.axeCheck();

    cy.get('.usa-input-error-message').contains(
      'Please choose a service type.',
    );
    cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
    cy.get('#downshift-1-item-0').click();
    cy.get('.usa-input-error-message').should('not.exist');
  });
});
