import {
  RECEIVE_SCHEDULED_DOWNTIME,
  RETRIEVE_SCHEDULED_DOWNTIME
} from '../actions';


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
        isPending: false,
        serviceMap: action.map
      };

    case RETRIEVE_SCHEDULED_DOWNTIME:
      return {
        ...state,
        isPending: true
      };
    default:
      return state;
  }
}
