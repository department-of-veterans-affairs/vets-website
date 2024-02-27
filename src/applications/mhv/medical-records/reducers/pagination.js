import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The initial pagination page being displayed to the user.
   */
  page: [
    {
      domain: 'lab and test results',
      value: 1,
    },
    {
      domain: 'allergies',
      value: 1,
    },
    {
      domain: 'vaccines',
      value: 1,
    },
    {
      domain: 'vitals',
      value: 1,
    },
    {
      domain: 'health conditions',
      value: 1,
    },
    {
      domain: 'care summaries and notes',
      value: 1,
    },
    {
      domain: 'other',
      value: 1,
    },
  ],
};

export const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Pagination.SET_PAGINATION: {
      return {
        ...state,
        page: state.page.map(
          index =>
            index.domain === action.payload.domain
              ? { ...index, value: action.payload.value }
              : index,
        ),
      };
    }
    case Actions.Pagination.RESET_PAGINATION: {
      return {
        ...state,
        page: state.page.map(
          index =>
            index.domain !== action.payload.domain
              ? { ...index, value: action.payload.value }
              : index,
        ),
      };
    }
    default:
      return state;
  }
};
