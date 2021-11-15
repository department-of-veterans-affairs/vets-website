const initialState = {
  appointments: [],
  context: {},
  form: {},
};

import {} from '../actions';

const preCheckInReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NO_ACTION':
      return {};
    case 'CREATE_FROM':
      return {
        ...state,
        form: { ...state.form, pages: action.payload.pages },
      };
    case 'INIT_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage,
        },
      };
    case 'GO_TO_NEXT_PAGE':
      return {
        ...state,
        form: { ...state.form, currentPage: action.payload.form.nextPage },
      };
    default:
      return { ...state };
  }
};

export default {
  preCheckInData: preCheckInReducer,
};
