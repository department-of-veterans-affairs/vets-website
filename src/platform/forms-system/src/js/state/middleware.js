import { updateActiveFormPageContext } from './activeFormPageContext';

export const updateActiveFormPageContextMiddleware = (formState, action) => {
  if (action.type === 'UPDATE_ROUTE' && formState?.pages) {
    const newPath = action.location?.path;
    updateActiveFormPageContext(formState.pages, newPath);
  }

  return action;
};

/**
 * Redux middleware for `store.form`
 *
 * Usually middleware is handled in `platform/startup/store.js`, however to keep
 * `platform/startup` package and `platform/forms-system` package separate, we are
 * handling `store.form` middleware here, since all the respective logic is in forms-system
 *
 * No dispatches or mutations should be made in this middleware.
 *
 * @param {Object} formState store.form state
 * @param {Object} action any action dispatched from redux
 */
export const applyFormMiddleware = (formState, action) => {
  return updateActiveFormPageContextMiddleware(formState, action);
};
