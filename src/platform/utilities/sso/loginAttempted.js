import localStorage from 'platform/utilities/storage/localStorage';

/*
 * When set, the `loginAttempted` indicates that the current unauthenticated
 * user will have to "manually" authenticate against SSOe in order to establish a
 * session, as a previous attempt may have failed so we need to prevent Auto Login
 * attempts.
 */
export const getLoginAttempted = () => localStorage.getItem('loginAttempted');

export const setLoginAttempted = () =>
  localStorage.setItem('loginAttempted', true);

export const removeLoginAttempted = () =>
  localStorage.removeItem('loginAttempted');
