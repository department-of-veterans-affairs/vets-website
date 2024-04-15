import {
  GET_DATA,
  GET_DATA_SUCCESS,
  UPDATE_PENDING_VERIFICATIONS,
  UPDATE_VERIFICATIONS,
} from '../actions';

const initialState = {
  data: null,
  loading: false,
};

const getDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        loading: true,
      };
    case GET_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.response,
      };
    case UPDATE_PENDING_VERIFICATIONS:
      return {
        ...state,
        data: {
          ...state.data,
          'vye::UserInfo': {
            ...state.data['vye::UserInfo'],
            pendingVerifications: action.payload,
          },
        },
      };
    case UPDATE_VERIFICATIONS:
      return {
        ...state,
        data: {
          ...state.data,
          'vye::UserInfo': {
            ...state.data['vye::UserInfo'],
            verifications: [
              ...state.data['vye::UserInfo'].verifications,
              ...action.payload,
            ],
          },
        },
      };
    default:
      return state;
  }
};

export default getDataReducer;
