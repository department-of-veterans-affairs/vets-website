import { hasSession } from 'platform/user/profile/utilities';

/**
 * Wrapper for data loaders that will only run if the user is authenticated.
 *
 * @param {function} loader - The data loader function to be wrapped.
 * @returns {function|null} - A function that runs the loader if the user is authenticated, or null if not.
 */
export const authenticatedLoader = loader => {
  const userHasSession = hasSession() === true || hasSession() === 'true';

  return async (...args) => {
    if (!userHasSession) {
      return null;
    }

    return loader(...args);
  };
};
