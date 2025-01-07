import { hasSession } from 'platform/user/profile/utilities';

/**
 * Wrapper for data loaders that will only run if the user is authenticated.
 *
 * @param {function} loader
 * @returns null|function
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
