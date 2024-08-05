import { SET_LAST_PAGE } from '../actions/types';

const initialState = {
  lastPage: null,
  history: [],
};

export default function routingReducer(state = initialState, action) {
  if (action.type === SET_LAST_PAGE) {
    return {
      ...state,
      lastPage: action.page,
      history: state.history.concat(action.page.substr(1)),
    };
  }
  return state;
}
