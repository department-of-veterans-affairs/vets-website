import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
} from '../actions';

// using mock data until api available
import { mockUserData } from '../utils/mockData';

const initialState = {
  pending: false,
  errors: null,
  statements: [...mockUserData],
};

const medicalCopaysReducer = (state = initialState, action) => {
  switch (action.type) {
    case MCP_STATEMENTS_FETCH_INIT:
      return {
        ...state,
        pending: true,
      };
    case MCP_STATEMENTS_FETCH_SUCCESS:
      return {
        ...state,
        pending: false,
        statements: action.response,
      };
    case MCP_STATEMENTS_FETCH_FAILURE:
      return {
        ...state,
        pending: false,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default {
  mcp: medicalCopaysReducer,
};
