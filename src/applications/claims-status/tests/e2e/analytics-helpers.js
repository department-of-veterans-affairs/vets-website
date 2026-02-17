/**
 * Assert that a specific event exists in the dataLayer with expected attributes (retryable)
 * @param {string} eventName - Name of the event to check for
 * @param {Array<string>|Object} attributesOrObject - Either:
 *   - Array of property names to assert existence
 *   - Object with key-value pairs to assert exact values
 * @returns {Cypress.Chainable} Cypress chainable for further assertions
 */
export const assertDataLayerEvent = (eventName, attributesOrObject = []) => {
  return cy
    .window()
    .its('dataLayer')
    .should(dl => {
      const events = dl.filter(d => d.event === eventName);

      expect(
        events.length,
        `Event "${eventName}" should exist in dataLayer`,
      ).to.be.greaterThan(0);

      const event = events[events.length - 1]; // Get most recent event

      // If it's an array, just check that properties exist
      if (Array.isArray(attributesOrObject)) {
        attributesOrObject.forEach(key => {
          expect(Object.keys(event)).to.include(key);
        });
      } else {
        // If it's an object, check exact values
        Object.entries(attributesOrObject).forEach(([key, value]) => {
          expect(event[key], `Event property "${key}"`).to.equal(value);
        });
      }
    });
};

/**
 * Assert that the most recent event of a specific type has certain attributes
 * @param {Window} w - Cypress window object
 * @param {string} eventName - Name of the event to check for
 * @param {Object} attributes - Expected attributes and their values
 */
export const assertEventAttributes = (w, eventName, attributes) => {
  const events = w.dataLayer.filter(d => d.event && d.event === eventName);

  expect(events.length).to.be.greaterThan(0);

  const latestEvent = events[events.length - 1];

  Object.entries(attributes).forEach(([key, value]) => {
    expect(latestEvent[key]).to.equal(value);
  });

  return latestEvent;
};

/**
 * Get the count of a specific event in the dataLayer
 * @param {Window} w - Cypress window object
 * @param {string} eventName - Name of the event to count
 * @returns {number} Count of events
 */
export const getEventCount = (w, eventName) => {
  return w.dataLayer.filter(d => d.event && d.event === eventName).length;
};

/**
 * Clear the dataLayer (useful for resetting between tests)
 * Can be called directly or within cy.window().then()
 */
export const clearDataLayer = () => {
  cy.window().then(w => {
    if (w.dataLayer) {
      // eslint-disable-next-line no-param-reassign
      w.dataLayer.length = 0;
    }
  });
};
