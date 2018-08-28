let state = null;

export function setupRoutes(_state) {
  state = _state;
}

/**
 * Accepts a Vets.gov page path and resolves it to the VA.gov page path in the event that brand-consolidation is enabled and that page has moved.
 * @param {string} path - The Vets.gov page path
 * @returns {string} The resolved path of the page
 */
export default function getRoute(path) {
  const {
    brandConsolidationEnabled,
    routes = []
  } = state.buildSettings;

  if (!brandConsolidationEnabled) return path;

  const route = routes.find(r => r['vets.gov'] === path);
  if (!route) {
    /* eslint-disable no-console */
    console.warn(`Route ${path} was not found.`);
  }

  return route['va.gov'];
}
