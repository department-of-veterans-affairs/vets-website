import { createServiceMap } from '../util/helpers';

import {
  RECEIVE_GLOBAL_DOWNTIME,
  RECEIVE_SCHEDULED_DOWNTIME,
  RETRIEVE_SCHEDULED_DOWNTIME,
  INIT_DISMISSED_DOWNTIME_APPROACHING_MODALS,
  DISMISS_DOWNTIME_APPROACHING_MODAL,
} from '../actions';

const initialState = {
  globalDowntime: null,
  isReady: false,
  isPending: false,
  serviceMap: null,
  dismissedDowntimeWarnings: [],
};

export default function scheduledDowntime(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_GLOBAL_DOWNTIME:
      return {
        ...state,
        globalDowntime: action.downtime,
      };

    case RECEIVE_SCHEDULED_DOWNTIME:
      return {
        ...state,
        isReady: true,
        isPending: false,
        serviceMap: createServiceMap(action.data),
      };

    case RETRIEVE_SCHEDULED_DOWNTIME:
      return {
        ...state,
        isPending: true,
      };

    case INIT_DISMISSED_DOWNTIME_APPROACHING_MODALS:
      return {
        ...state,
        dismissedDowntimeWarnings: action.dismissedDowntimeWarnings,
      };

    case DISMISS_DOWNTIME_APPROACHING_MODAL: {
      const dismissedDowntimeWarnings = state.dismissedDowntimeWarnings.concat(
        action.appTitle,
      );
      return {
        ...state,
        dismissedDowntimeWarnings,
      };
    }

    default:
      return state;
  }
}
