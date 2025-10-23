import {
  NOTIFICATIONS_RECEIVED_FAILED,
  NOTIFICATIONS_RECEIVED_STARTED,
  NOTIFICATIONS_RECEIVED_SUCCEEDED,
  NOTIFICATION_DISMISSAL_FAILED,
  NOTIFICATION_DISMISSAL_STARTED,
  NOTIFICATION_DISMISSAL_SUCCEEDED,
} from '../actions/notifications';

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
    case NOTIFICATION_DISMISSAL_STARTED:
      return {
        ...state,
        isLoading: true,
        dismissalError: false,
      };
    case NOTIFICATION_DISMISSAL_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        dismissalError: false,
        successful: true,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };
    case NOTIFICATION_DISMISSAL_FAILED:
      return {
        ...state,
        isLoading: false,
        dismissalError: true,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default notificationsReducer;
