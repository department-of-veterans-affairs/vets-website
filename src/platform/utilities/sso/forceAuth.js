import localStorage from '../storage/localStorage';

/*
 * When set, the `requiresForceAuth` indicates that the current unauthenticated
 * user will have to "force" authentication against SSOe in order to establish a
 * session.
 */
export const getForceAuth = () => {
  localStorage.getItem('requiresForceAuth');
};

export const setForceAuth = () => {
  localStorage.setItem('requiresForceAuth', true);
};

export const removeForceAuth = () => {
  localStorage.removeItem('requiresForceAuth');
};
