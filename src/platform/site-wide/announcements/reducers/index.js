import {
  INIT_DISMISSED_ANNOUNCEMENTS,
  DISMISS_ANNOUNCEMENT
} from '../actions';

const initialState = {
  dismissed: []
};

export default function announcements(state = initialState, action) {
  switch (action.type) {
    case INIT_DISMISSED_ANNOUNCEMENTS:
      return {
        ...state,
        dismissed: action.dismissedAnnouncements
      };

    case DISMISS_ANNOUNCEMENT:
      return {
        ...state,
        dismissed: state.dismissed.concat(action.announcement)
      };

    default:
      return state;
  }
}
