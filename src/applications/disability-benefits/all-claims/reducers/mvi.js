import set from 'platform/utilities/data/set';
import {
  MVI_ADD_NOT_ATTEMPTED,
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../actions';

const initialState = {
  addPersonState: MVI_ADD_NOT_ATTEMPTED,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MVI_ADD_INITIATED:
      return set('addPersonState', MVI_ADD_INITIATED, state);
    case MVI_ADD_SUCCEEDED: {
      return set('addPersonState', MVI_ADD_SUCCEEDED, state);
    }
    case MVI_ADD_FAILED:
      return set('addPersonState', MVI_ADD_FAILED, state);
    default:
      return state;
  }
};
