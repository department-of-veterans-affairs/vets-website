export const toggleValues = state => state.featureToggles || {};
export const isProduction = state => toggleValues(state).production;
export const facilityLocatorShowCommunityCares = state =>
  toggleValues(state).facilityLocatorShowCommunityCares;
