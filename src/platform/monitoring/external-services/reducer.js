import {
  FETCH_BACKEND_STATUSES_FAILURE,
  FETCH_BACKEND_STATUSES_SUCCESS,
  LOADING_BACKEND_STATUSES,
} from './actions';

const INITIAL_STATE = {
  loading: false,
  statuses: null,
  maintenanceWindows: [],
};

export default function externalServiceStatuses(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOADING_BACKEND_STATUSES:
      return { ...state, loading: true };

    case FETCH_BACKEND_STATUSES_FAILURE:
      return { ...state, loading: false };

    case FETCH_BACKEND_STATUSES_SUCCESS: {
      const { statuses, maintenanceWindows } = action.data.attributes;
      return { ...state, loading: false, statuses, maintenanceWindows };
    }

    default:
      return state;
  }
}
