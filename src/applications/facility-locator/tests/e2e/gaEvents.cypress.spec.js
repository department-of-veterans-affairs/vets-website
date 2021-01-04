import path from 'path';
import {
  assertDataLayerEvent,
  assertDataLayerLastItems,
  assertEventAndAttributes,
} from './analyticsUtils';

describe('Google Analytics FL Events', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  it('should search, pan map, click marker, zoom in and out and verify ga events related', () => {
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

      [...Array(5)].forEach(_ =>
        cy.get('.mapboxgl-ctrl-zoom-in').click({ waitForAnimations: true }),
      );
      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-in');
      });

      cy.get('.mapboxgl-ctrl-zoom-out').click({ waitForAnimations: true });

      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-out');
      });

      cy.get('.mapboxgl-canvas').swipe(
        [[310, 300], [310, 320], [310, 340], [310, 360], [310, 380]],
        [[50, 300], [50, 320], [50, 340], [50, 360], [50, 380]],
      );
      cy.get('#mapbox-gl-container').click({ waitForAnimations: true });

      cy.get('#mapbox-gl-container', { timeout: 10000 }).should(() => {
        assertDataLayerLastItems(
          win,
          ['event', 'fl-map-miles-moved'],
          'fl-search',
        );
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
