import { RECEIVE_SCHEDULED_DOWNTIME, RETREIVE_SCHEDULED_DOWNTIME } from '../actions';

const initialState = {
  scheduledDowntime: null
};

export function scheduledDowntime(state = initialState.scheduledDowntime, action) {
  switch (action.type) {
    case RECEIVE_SCHEDULED_DOWNTIME:
      return action.value;
    case RETREIVE_SCHEDULED_DOWNTIME:
    default:
      return state;
  }
}
