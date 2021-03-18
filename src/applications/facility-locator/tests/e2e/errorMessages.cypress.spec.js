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
    cy.visit('/find-locations');
  });

  afterEach(() => {
    cy.injectAxe();
    cy.axeCheck();
  });

  it('shows error message in location field on invalid search', () => {
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('.usa-input-error-message').contains(
      'Please fill in a city, state, or postal code.',
    );
    cy.get('#street-city-state-zip').should('be.focused');
  });

  it('shows error message on leaving location field empty', () => {
    cy.get('#street-city-state-zip').focus();
    cy.get('#facility-type-dropdown').focus();
    cy.get('.usa-input-error-message').contains(
      'Please fill in a city, state, or postal code.',
    );
    cy.get('#street-city-state-zip').type('A');
    cy.get('.usa-input-error-message').should('not.exist');
  });

  it('shows error message when leaving facility type field empty', () => {
    cy.get('#facility-type-dropdown').focus();
    cy.get('#street-city-state-zip').focus();
    cy.get('.usa-input-error-message').contains(
      'Please choose a facility type.',
    );
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('.usa-input-error-message').should('not.exist');
  });

  it('shows error message when leaving service type field epmty', () => {
    cy.get('#facility-type-dropdown').select(
      'Community providers (in VA’s network)',
    );
    cy.get('#service-type-ahead-input').focus();
    cy.get('#facility-search').focus();
    cy.get('.usa-input-error-message').contains(
      'Please choose a service type.',
    );
    cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
    cy.get('#downshift-1-item-0').click();
    cy.get('.usa-input-error-message').should('not.exist');
  });
});
