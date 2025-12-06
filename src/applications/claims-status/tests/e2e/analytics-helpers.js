/**
 * Assert that a specific event exists in the dataLayer
 * @param {Window} w - Cypress window object
 * @param {string} eventName - Name of the event to check for
 */
export const assertDataLayerEvent = (w, eventName) => {
  const event = w.dataLayer.find(d => d.event && d.event === eventName);

  assert.isObject(event, `Event "${eventName}" should exist in dataLayer`);

  return event;
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
