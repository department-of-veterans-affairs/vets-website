import { FETCH_INQUIRIES } from '../actions';

const initialState = {
  data: [],
};

export const inquiryReducer = (state = initialState, action) => {
  if (action.type === FETCH_INQUIRIES) {
    return {
      ...state,
      data: action.data,
    };
  } else {
    return state;
  }
};
