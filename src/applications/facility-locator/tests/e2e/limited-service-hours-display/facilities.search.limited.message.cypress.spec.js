import data from './mock/search.limited.services.mocks.json';

describe('Facility VA search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('POST', 'facilities_api/v2/va*', data).as('mockedData');
  });

  it('does a simple search and finds a result on the list', () => {
    /* eslint-disable camelcase */
    cy.intercept('GET', '/geocoding/**/*', {
      type: 'FeatureCollection',
      query: ['30310'],
      features: [
        {
          id: 'place.mock',
          type: 'Feature',
          place_type: ['place'],
          relevance: 1,
          properties: {},
          text: 'Atlanta',
          place_name: 'Atlanta, Georgia 30310',
          center: [-84.4227, 33.7235],
          geometry: { type: 'Point', coordinates: [-84.4227, 33.7235] },
          context: [
            { id: 'region.mock', short_code: 'US-GA', text: 'Georgia' },
            { id: 'country.mock', short_code: 'us', text: 'United States' },
          ],
        },
      ],
    });
    /* eslint-enable camelcase */
    cy.visit('/find-locations');

    cy.injectAxeThenAxeCheck();

    cy.get('#street-city-state-zip').type('30310');
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select('Vet Centers');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'near "Atlanta, Georgia 30310"',
    );

    cy.get('[data-testid="limited-message"]').should('be.visible');
  });
});
