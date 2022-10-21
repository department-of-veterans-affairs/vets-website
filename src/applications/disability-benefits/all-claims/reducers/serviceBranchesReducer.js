import set from 'platform/utilities/data/set';
import {
  GET_MILITARY_SERVICE_BRANCHES_SUCCEEDED,
  GET_MILITARY_SERVICE_BRANCHES_FAILED,
} from '../actions';

const initialState = {
  militaryServiceBranches: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MILITARY_SERVICE_BRANCHES_SUCCEEDED: {
      return set('militaryServiceBranches', action.items, state);
    }
    case GET_MILITARY_SERVICE_BRANCHES_FAILED:
      return set(
        'militaryServiceBranches',
        [], // TODO: fall back to json schema form?
        state,
      );
    default:
      return state;
  }
};
