import { Actions } from '../util/actionTypes';

export const setBreadcrumbs = (crumbs, location) => async dispatch => {
  dispatch({
    type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
    payload: { crumbs, location },
  });
};
