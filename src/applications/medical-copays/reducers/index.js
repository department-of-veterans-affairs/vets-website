import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
} from '../actions';

const initialState = {
  pending: true,
  errors: null,
  statements: [],
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
