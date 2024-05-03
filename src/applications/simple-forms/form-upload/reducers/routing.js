import { SET_LAST_PAGE } from '../actions/types';

const initialState = {
  lastPage: null,
  history: [],
};

export default function routingReducer(state = initialState, action) {
  if (action.type === SET_LAST_PAGE) {
    const lastPage = state.history.length
      ? state.history[state.history.length - 1]
      : null;
    return {
      ...state,
      lastPage,
      history: state.history.concat(action.page.substr(1)),
    };
  }
  return state;
}
