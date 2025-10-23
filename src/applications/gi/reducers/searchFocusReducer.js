import { FOCUS_SEARCH } from '../actions';

const focusSearchReducer = (state = { focusOnSearch: false }, action) => {
  switch (action.type) {
    case FOCUS_SEARCH:
      return {
        ...state,
        focusOnSearch: true,
      };
    case 'RESET_FOCUS':
      return {
        ...state,
        focusOnSearch: false,
      };
    default:
      return state;
  }
};

export default focusSearchReducer;
