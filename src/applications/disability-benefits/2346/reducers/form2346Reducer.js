import {
    FETCH_DATA_SUCCESS,
    FETCH_DATA_FAILURE,
    UPDATE_DATA_FAILURE,
    UPDATE_DATA_SUCCESS,
    CHECKBOX_STATE_UPDATE
  } from '../constants';

  const initialState = {
      data: [],
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
          // BUG: Checkbox state defects -@maharielrosario at 12/30/2019, 5:58:40 PM
          // Checkbox state overwrites DLC API data
          case CHECKBOX_STATE_UPDATE:
            return {
                ...state,
                data: action.payload
            };

          default:
              return state;
      }
  }
