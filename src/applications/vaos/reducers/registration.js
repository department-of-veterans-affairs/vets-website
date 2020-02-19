import { FETCH_STATUS } from '../utils/constants';

import {
  REGISTRATION_CHECK,
  REGISTRATION_CHECK_FAILED,
  REGISTRATION_CHECK_SUCCEEDED,
} from '../actions/registration';

const initialState = {
  status: FETCH_STATUS.notStarted,
  hasRegisteredSystems: null,
};

export default function registrationReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTRATION_CHECK:
      return {
        ...state,
        status: FETCH_STATUS.loading,
      };
    case REGISTRATION_CHECK_SUCCEEDED:
      return {
        ...state,
        status: FETCH_STATUS.succeeded,
        hasRegisteredSystems: action.userIds.some(id =>
          id.assigningAuthority.startsWith('dfn-'),
        ),
      };
    case REGISTRATION_CHECK_FAILED:
      return {
        ...state,
        status: FETCH_STATUS.failed,
      };
    default:
      return state;
  }
}
