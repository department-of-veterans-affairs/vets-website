import { Actions } from '../util/actionTypes';

export const setBreadcrumbs = crumbs => async dispatch => {
  dispatch({
    type: Actions.Breadcrumbs.SET_BREAD_CRUMBS,
    payload: { crumbs },
  });
};

export const setPreviousUrl = url => async dispatch => {
  dispatch({
    type: Actions.Breadcrumbs.SET_PREVIOUS_URL,
    payload: url,
  });
};
