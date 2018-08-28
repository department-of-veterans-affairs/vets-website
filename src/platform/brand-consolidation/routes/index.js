let state = null;

export function setupRoutes(_state) {
  state = _state;
}

/**
 * Accepts a Vets.gov page path and resolves it to the VA.gov page path in the event that brand-consolidation is enabled and that page has moved.
 * @param {string} vetsPath - The Vets.gov page path
 * @returns {string} The resolved path of the page
 */
export default function getRoute(vetsPath) {
  const {
    brandConsolidationEnabled,
    routes = []
  } = state.buildSettings;

  if (!brandConsolidationEnabled) return vetsPath;

  const route = routes.find(r => r['vets.gov'] === vetsPath);
  if (!route) {
    /* eslint-disable no-console */
    console.warn(`Route ${vetsPath} was not found.`);
  }

  return route['va.gov'];
}
