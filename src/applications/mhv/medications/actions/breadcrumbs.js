import { Actions } from '../util/actionTypes';

export const setBreadcrumbs = crumbs => async dispatch => {
  dispatch({
    type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
    payload: { crumbs },
  });
};

export const removeBreadcrumbs = () => async dispatch => {
  dispatch({
    type: Actions.Breadcrumbs.REMOVE_BREAD_CRUMB,
  });
};
export const clearBreadcrumbs = () => async dispatch => {
  dispatch({
    type: Actions.Breadcrumbs.CLEAR_BREAD_CRUMB,
  });
};
