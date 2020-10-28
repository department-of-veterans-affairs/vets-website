import path from 'path';
import {
  assertDataLayerEvent,
  assertEventAndAttributes,
} from './analyticsUtils';

describe('Google Analytics FL Events', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  it('should search, click marker, zoom in and out and verify ga events related', () => {
    cy.visit('/find-locations');

    cy.window().then(win => {
      // Search
      cy.get('#street-city-state-zip').type('Austin, TX');
      cy.get('#facility-type-dropdown').select('VA health');
      cy.get('#facility-search').click();
      cy.injectAxe();
      cy.axeCheck();

      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-search');
      });

      cy.get('.i-pin-card-map')
        .first()
        .click()
        .as('markerClick')
        .then(() => {
          assertEventAndAttributes(win, 'fl-map-pin-click', [
            'event',
            'fl-facility-type',
            'fl-facility-id',
            'fl-facility-classification',
            'fl-facility-name',
            'fl-facility-distance-from-search',
          ]);
        });

      // Zoom in and out twice to ensure ga event fires
      // mapbox will record it on dragend
      cy.get('.mapboxgl-ctrl-zoom-in').click({ waitForAnimations: true });
      cy.get('.mapboxgl-ctrl-zoom-in').click({ waitForAnimations: true });

      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-in');
      });

      cy.get('.mapboxgl-ctrl-zoom-out').click({ waitForAnimations: true });
      cy.get('.mapboxgl-ctrl-zoom-out').click({ waitForAnimations: true });

      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-out');
      });

      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-out');
      });

      cy.findByText(/austin va clinic/i, { selector: 'a' })
        .first()
        .click();

      cy.get('#facility-detail-id', { timeout: 10000 }).should(() => {
        assertEventAndAttributes(win, 'fl-results-click', [
          'fl-facility-name',
          'fl-facility-type',
          'fl-facility-classification',
          'fl-facility-id',
          'fl-result-page-number',
          'fl-result-position',
        ]);
      });
    });
  });
});
