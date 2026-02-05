/**
 * E2E test helpers for the VA Virtual Agent Chatbot
 */

import featureToggles from '../fixtures/mocks/feature-toggles.json';

/**
 * Mocks the feature toggles required for the virtual agent chatbot.
 * Call this in beforeEach() before visiting the page.
 *
 * @returns {void}
 *
 * @example
 * beforeEach(() => {
 *   mockFeatureToggles();
 * });
 */
export const mockFeatureToggles = () => {
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
    'mockFeatures',
  );
};
