import {
  RECEIVE_SCHEDULED_DOWNTIME,
  RETREIVE_SCHEDULED_DOWNTIME,
  SET_CURRENT_DOWNTIME_STATUS,
  UNSET_CURRENT_DOWNTIME_STATUS
} from '../actions';

const initialState = {
  scheduledDowntime: {
    isReady: false,
    values: [],
    status: {}
  }
};

export function scheduledDowntime(state = initialState.scheduledDowntime, action) {
  switch (action.type) {
    case RECEIVE_SCHEDULED_DOWNTIME:
      return {
        isReady: true,
        status: state.status,
        values: action.value
      };
    case SET_CURRENT_DOWNTIME_STATUS:
      state.status = action.value;
      return state;
    case UNSET_CURRENT_DOWNTIME_STATUS:
      state.status = {};
      return state;
    case RETREIVE_SCHEDULED_DOWNTIME:
    default:
      return state;
  }
}
