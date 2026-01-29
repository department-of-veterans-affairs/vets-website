import { defer } from 'react-router-dom-v5-compat';
import { store } from '../store';
import { getRefillablePrescriptions } from '../api/refillsApi';

/**
 * Route loader for refills page
 * Initiates data fetch using RTK Query when route is accessed
 * Returns deferred promise for React Router to handle
 *
 * This loader is called before the route component renders,
 * allowing data to be prefetched and cached by RTK Query
 *
 * @returns {DeferredData} Deferred promise containing the API request
 */
export const refillsLoader = () => {
  // Dispatch RTK Query endpoint to start fetching
  // RTK Query will cache the result automatically
  const fetchPromise = store.dispatch(
    getRefillablePrescriptions.initiate(undefined),
  );

  // Return deferred promise - React Router will handle the loading state
  return defer(fetchPromise);
};
