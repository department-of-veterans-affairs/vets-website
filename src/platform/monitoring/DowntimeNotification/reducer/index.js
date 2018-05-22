import { createServiceMap } from '../util/helpers';

import {
  RECEIVE_SCHEDULED_DOWNTIME,
  RETRIEVE_SCHEDULED_DOWNTIME,
  DISMISS_DOWNTIME_APPROACHING_MODAL
} from '../actions';

const DISMISSED_DOWNTIME_WARNINGS = 'DISMISSED_DOWNTIME_WARNINGS';
function getDismissedDowntimeApproachingModals() {
  const rawData = window.sessionStorage[DISMISSED_DOWNTIME_WARNINGS];
  return rawData ? JSON.parse(rawData) : [];
}

const initialState = {
  isReady: false,
  isPending: false,
  serviceMap: null,
  dismissedDowntimeApproachingModals: getDismissedDowntimeApproachingModals()
};

export default function scheduledDowntime(state = initialState, action) {
  switch (action.type) {

    case RECEIVE_SCHEDULED_DOWNTIME:
      return {
        ...state,
        isReady: true,
        isPending: false,
        serviceMap: createServiceMap(action.data)
      };

    case RETRIEVE_SCHEDULED_DOWNTIME:
      return {
        ...state,
        isPending: true
      };

    case DISMISS_DOWNTIME_APPROACHING_MODAL: {
      const dismissedDowntimeApproachingModals = state.dismissedDowntimeApproachingModals.concat(action.appTitle);
      window.sessionStorage[DISMISSED_DOWNTIME_WARNINGS] = JSON.stringify(dismissedDowntimeApproachingModals);
      return {
        ...state,
        dismissedDowntimeApproachingModals
      };
    }

    default:
      return state;
  }
}
