import {
  FETCH_BACKEND_STATUSES_FAILURE,
  FETCH_BACKEND_STATUSES_SUCCESS,
  LOADING_BACKEND_STATUSES,
  FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE,
  FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
  LOADING_LOGIN_GOV_STATE_INCIDENTS,
} from './actions';

const INITIAL_STATE = {
  loading: false,
  statuses: null,
  maintenanceWindows: [],
  loginGovStateIncidents: {
    loading: false,
    incidents: [],
    error: null,
  },
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

    case LOADING_LOGIN_GOV_STATE_INCIDENTS:
      return {
        ...state,
        loginGovStateIncidents: { ...state.loginGovStateIncidents, loading: true },
      };

    case FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE:
      return {
        ...state,
        loginGovStateIncidents: {
          loading: false,
          incidents: [],
          error: true,
        },
      };

    case FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS: {
      const incidents = action.data.attributes?.incidents || [];
      return {
        ...state,
        loginGovStateIncidents: {
          loading: false,
          incidents,
          error: null,
        },
      };
    }

    default:
      return state;
  }
}
