import { setActiveContext } from '../actions';
import { activeContextFromFormPages } from '../helpers';

/**
 * Redux middleware for `store.form.activeContext`
 *
 * When UPDATE_ROUTE action is dispatched from a navigation change,
 * this would normally be ignored by `store.form` reducer. So we
 * can leverage this event and transform it into a SET_ACTIVE_CONTEXT
 * action for `store.form.activeContext`
 *
 * @param {Object} formState store.form state
 * @param {Object} action any action dispatched from redux
 */
export const applyActiveContextMiddleware = (formState, action) => {
  let nextAction = action;

  if (action.type === 'UPDATE_ROUTE' && formState?.pages) {
    const newPath = action.location?.path;
    const activeContext = activeContextFromFormPages(formState.pages, newPath);
    nextAction = setActiveContext(activeContext);
  }

  return nextAction;
};

/**
 * Redux middleware for `store.form`
 *
 * Usually middleware is handled in `platform/startup/store.js`, however to keep
 * `platform/startup` package and `platform/forms-system` package separate, we are
 * handling `store.form` middleware here, since all the respective logic is in forms-system
 *
 * No dispatches should be made in this middleware.
 *
 * @param {Object} formState store.form state
 * @param {Object} action any action dispatched from redux
 */
export const applyFormMiddleware = (formState, action) => {
  return applyActiveContextMiddleware(formState, action);
};
