import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of lab and test results returned from the api
   * @type {array}
   */
  labsAndTestsList: undefined,
  /**
   * The lab or test result currently being displayed to the user
   */
  labsAndTestsDetails: undefined,
};

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      return {
        ...state,
        labsAndTestsDetails: action.response,
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      return {
        ...state,
        labsAndTestsList: action.response.map(labsAndTests => {
          return { ...labsAndTests };
        }),
      };
    }
    default:
      return state;
  }
};
