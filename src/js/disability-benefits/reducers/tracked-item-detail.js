import {
  SET_TRACKED_ITEM,
} from '../actions';

const initialState = {};

export default function trackedItemReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TRACKED_ITEM: {
      return action.item;
    }
    default:
      return state;
  }
}

