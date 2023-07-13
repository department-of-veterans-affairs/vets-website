import {
  NOTIFICATIONS_RECEIVED_FAILED,
  NOTIFICATIONS_RECEIVED_STARTED,
  NOTIFICATIONS_RECEIVED_SUCCEEDED,
} from '../../common/actions/notifications';

const initialState = {
  isLoading: false,
  notificationError: false,
  dismissalError: false,
  notifications: [],
};

export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATIONS_RECEIVED_STARTED:
      return {
        ...state,
        isLoading: true,
        notificationError: false,
      };
    case NOTIFICATIONS_RECEIVED_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        notificationError: false,
        notifications: action.notifications,
      };
    case NOTIFICATIONS_RECEIVED_FAILED:
      return {
        ...state,
        isLoading: false,
        notificationError: true,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default notificationsReducer;
