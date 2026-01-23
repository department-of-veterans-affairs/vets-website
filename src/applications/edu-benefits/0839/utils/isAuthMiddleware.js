import { setData } from 'platform/forms-system/src/js/actions';

export const isAuthMiddleware = store => next => action => {
  if (action.type === 'UPDATE_LOGGEDIN_STATUS') {
    next(
      setData({ ...store.getState().form.data, isAuthenticated: action.value }),
    );
  }
  return next(action);
};
