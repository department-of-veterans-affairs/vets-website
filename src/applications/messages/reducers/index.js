import { FETCH_INQUIRIES } from '../actions';

const initialState = {
  data: [],
};

export const InquiryReducer = (state = initialState, action) => {
  if (action.type === FETCH_INQUIRIES) {
    return {
      ...state,
      ...action.data,
    };
  } else {
    return state;
  }
};
