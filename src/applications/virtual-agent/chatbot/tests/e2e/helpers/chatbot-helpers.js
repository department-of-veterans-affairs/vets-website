/**
 * E2E test helpers for the VA Virtual Agent Chatbot
 */

/**
 * Default feature toggle values for the virtual agent chatbot
 */
const DEFAULT_FEATURE_TOGGLES = {
  virtualAgentChatbot: true,
  virtualAgentChatbotSessionPersistenceEnabled: false,
  virtualAgentEnableParamErrorDetection: false,
  virtualAgentUseStsAuthentication: false,
  virtualAgentShowAiDisclaimer: true,
};

/**
 * Mocks the feature toggles required for the virtual agent chatbot.
 * Call this in beforeEach() before visiting the page.
 *
 * @param {Object} overrides - Feature toggle values to override defaults
 * @returns {void}
 *
 * @example
 * beforeEach(() => {
 *   mockFeatureToggles({ virtualAgentChatbot: true });
 * });
 */
export const mockFeatureToggles = (overrides = {}) => {
  const toggles = { ...DEFAULT_FEATURE_TOGGLES, ...overrides };

  const features = Object.entries(toggles).map(([name, value]) => ({
    name,
    value,
  }));

  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      type: 'feature_toggles',
      features,
    },
  }).as('featureToggles');
};
