import { FETCH_INQUIRIES_SUCCESS } from '../actions';

const initialState = {
  data: [],
};

export const inquiryReducer = (state = initialState, action) => {
  if (action.type === FETCH_INQUIRIES_SUCCESS) {
    return {
      ...state,
      data: action.data,
    };
  } else {
    return state;
  }
};
