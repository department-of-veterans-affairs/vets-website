import {
  RECEIVE_SCHEDULED_DOWNTIME,
  RETREIVE_SCHEDULED_DOWNTIME
} from '../actions';


const initialState = {
  isReady: false,
  values: []
};

export default function scheduledDowntime(state = initialState, action) {
  switch (action.type) {

    case RECEIVE_SCHEDULED_DOWNTIME:
      return {
        isReady: true,
        values: action.value
      };

    case RETREIVE_SCHEDULED_DOWNTIME:
    default:
      return state;
  }
}
