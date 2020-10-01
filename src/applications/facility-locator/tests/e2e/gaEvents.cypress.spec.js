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

      cy.get('#map-id', { timeout: 10000 }).should(() => {
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
            'fl-facility-classification',
            'fl-facility-name',
            'fl-facility-distance-from-search',
          ]);
        });

      cy.get('.leaflet-control-zoom-in').click();
      cy.get('#map-id', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-in');
      });

      cy.get('.leaflet-control-zoom-out').click();
      cy.get('#map-id', { timeout: 10000 }).should(() => {
        assertDataLayerEvent(win, 'fl-map-zoom-out');
      });

      cy.get('#map-id').dragMapFromCenter({
        xMoveFactor: -1 / 6,
        yMoveFactor: 1 / 3,
      });
      cy.get('#map-id', { timeout: 10000 }).should(() => {
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

// Helper method
// Source - https://corto.link/KSSk1ZSR
Cypress.Commands.add(
  'dragMapFromCenter',
  { prevSubject: 'element' },
  (element, { xMoveFactor, yMoveFactor }) => {
    // Get the raw HTML element from jQuery wrapper
    const canvas = element.get(0);
    const rect = canvas.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Start dragging from the center of the map
    cy.log('mousedown', {
      clientX: center.x,
      clientY: center.y,
    });
    canvas.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: center.x,
        clientY: center.y,
      }),
    );

    // Let Leaflet know the mouse has started to move. The diff between
    // mousedown and mousemove event needs to be large enough so that Leaflet
    // will really think the mouse is moving and not that it was a click where
    // the mouse moved just a tiny amount.
    cy.log('mousemove', {
      clientX: center.x,
      clientY: center.y + 5,
    });
    canvas.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: center.x,
        clientY: center.y + 5,
        bubbles: true,
      }),
    );

    // After Leaflet knows mouse is moving, we move the mouse as depicted by the options.
    cy.log('mousemove', {
      clientX: center.x + rect.width * xMoveFactor,
      clientY: center.y + rect.height * yMoveFactor,
    });
    canvas.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: center.x + rect.width * xMoveFactor,
        clientY: center.y + rect.height * yMoveFactor,
        bubbles: true,
      }),
    );

    // Now when we "release" the mouse, Leaflet will fire a "dragend" event and
    // the search should register that the drag has stopped and run callbacks.
    cy.log('mouseup', {
      clientX: center.x + rect.width * xMoveFactor,
      clientY: center.y + rect.height * yMoveFactor,
    });
    requestAnimationFrame(() => {
      canvas.dispatchEvent(
        new MouseEvent('mouseup', {
          clientX: center.x + rect.width * xMoveFactor,
          clientY: center.y + rect.height * yMoveFactor,
          bubbles: true,
        }),
      );
    });
  },
);
