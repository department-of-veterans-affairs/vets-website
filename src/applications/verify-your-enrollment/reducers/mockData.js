// import _ from 'lodash';
import { USER_MOCK_DATA } from '../constants/mockData';

import { UPDATE_PENDING_VERIFICATIONS, UPDATE_VERIFICATIONS } from '../actions';

const INITIAL_STATE = {
  mockData: USER_MOCK_DATA,
};

const mockData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PENDING_VERIFICATIONS:
      // this delets all pending verifications award_ids
      return {
        ...state,
        mockData: {
          ...state.mockData,
          'vye::UserInfo': {
            ...state.mockData['vye::UserInfo'],
            pendingVerifications: action.payload,
          },
        },
      };
    //   case UPDATE_PENDING_VERIFICATIONS:
    // this appends data to pending verifications
    //     return {
    //       ...state,
    //       "vye::UserInfo": {
    //         ...state.mockData["vye::UserInfo"],
    //         pendingVerifications: action.payload,
    //       },
    //     };
    case UPDATE_VERIFICATIONS:
      return {
        ...state,
        mockData: {
          ...state.mockData,
          'vye::UserInfo': {
            ...state.mockData['vye::UserInfo'],
            verifications: [
              ...state.mockData['vye::UserInfo'].verifications,
              ...action.payload,
            ],
          },
        },
      };
    default:
      return state;
  }
};

export default mockData;
