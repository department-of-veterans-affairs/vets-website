import {
  RECEIVE_SCHEDULED_DOWNTIME,
  RETREIVE_SCHEDULED_DOWNTIME
} from './actions';


const initialState = {
  isReady: false,
  isPending: false,
  serviceMap: null
};

export default function scheduledDowntime(state = initialState, action) {
  switch (action.type) {

    case RECEIVE_SCHEDULED_DOWNTIME:
      return {
        isReady: true,
        serviceMap: action.map
      };

    case RETREIVE_SCHEDULED_DOWNTIME:
      return {
        ...state,
        isPending: true
      };
    default:
      return state;
  }
}
