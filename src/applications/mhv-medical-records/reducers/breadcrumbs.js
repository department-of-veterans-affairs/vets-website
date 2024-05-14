import { Actions } from '../util/actionTypes';

const initialState = {
  list: [],
  location: '',
};

export const breadcrumbsReducer = (state = initialState, action) => {
  if (action.type === Actions.Breadcrumbs.SET_BREAD_CRUMBS) {
    return { list: action.payload.crumbs, location: action.payload.location };
  }
  return state;
};
