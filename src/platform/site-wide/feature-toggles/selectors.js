export const toggleValues = state => state.featureToggles || {};
export const isProduction = state => toggleValues(state).production;
