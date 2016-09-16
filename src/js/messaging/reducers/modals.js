import set from 'lodash/fp/set';

import {
  TOGGLE_CONFIRM_DELETE
} from '../actions/modals';

const initialState = {
  deleteConfirm: {
    visible: false
  }
};

export default function modals(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CONFIRM_DELETE:
      return set('deleteConfirm.visible', !state.deleteConfirm.visible, state);
    default:
      return state;
  }
}
