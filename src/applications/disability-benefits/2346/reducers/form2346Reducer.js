import {
    FETCH_DATA_SUCCESS,
    FETCH_DATA_FAILURE,
    UPDATE_DATA_FAILURE,
    UPDATE_DATA_SUCCESS
  } from '../constants';

  const initialState = {
      data: {},
  }

  export default (state = initialState, action) => {
      switch (action.type) {
          case FETCH_DATA_SUCCESS:
              return {
                  ...state,
                  data: action.payload
              };

          case FETCH_DATA_FAILURE:
              return {
                  ...state,
                  error: action.payload
              };

          case UPDATE_DATA_SUCCESS:
              return {
                  ...state,
                  data: state.data.concat(action.payload)
              };

          case UPDATE_DATA_FAILURE:
              return {
                  ...state,
                  error: action.payload
              };

          default:
              return state;
      }
  }
