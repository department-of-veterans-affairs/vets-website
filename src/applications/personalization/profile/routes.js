import { routesForNav } from './routesForNav';

/**
 * Filter routes based on feature toggles.
 *
 * A route is removed from the returned array if its toggleName is not in the
 * feature toggle list, or if the toggle is false.
 *
 * @param {} toggles - Feature toggles object
 * @returns - Array of routes filtered by feature toggle
 */
const getRoutes = (toggles = {}) =>
  routesForNav.filter(({ toggleName }) => !toggleName || toggles[toggleName]);

export default getRoutes;
