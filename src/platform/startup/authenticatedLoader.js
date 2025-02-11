import { hasSession } from 'platform/user/profile/utilities';

/**
 * Wrapper for data loaders that will only run if the user is authenticated.
 *
 * NB: If you wrap your loader with this function, you must also
 *     wrap your component with the RequiredLoginView component.
 *
 * @param {Object} options - The options object.
 * @param {function} options.loader - The data loader function to be wrapped.
 * @param {Object} [options.fallbackValue={}] - The value to return if the user is not authenticated.
 * @returns {function} - A function that runs the loader if the user is authenticated, or returns the fallback value if not.
 */
export const authenticatedLoader = ({ loader, fallbackValue = {} }) => {
  const userHasSession = hasSession() === true || hasSession() === 'true';

  return async (...args) => {
    if (!userHasSession) {
      return fallbackValue;
    }

    return loader(...args);
  };
};
