import data from './mock/search.limited.services.mocks.json';

describe('Facility VA search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('POST', 'facilities_api/v2/va*', data).as('mockedData');
  });

  it('does a simple search and finds a result on the list', () => {
    cy.visit('/find-locations');

    cy.injectAxeThenAxeCheck();

    cy.get('#street-city-state-zip').type('30310');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('Vet Centers');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'within 68 miles of "Atlanta, Georgia 30310"',
    );

    cy.get('[data-testid="limited-message"]').should('be.visible');
  });
});
