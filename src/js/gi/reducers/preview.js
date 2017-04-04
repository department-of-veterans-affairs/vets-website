import { ENTER_PREVIEW_MODE, EXIT_PREVIEW_MODE } from '../actions';

const INITIAL_STATE = {
  display: false,
  version: {}
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ENTER_PREVIEW_MODE:
      return {
        display: true,
        version: action.version
      };
    case EXIT_PREVIEW_MODE:
      return INITIAL_STATE;
    default:
      return state;
  }
}
