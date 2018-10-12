import get from '../../../../platform/utilities/data/get';
import set from '../../../../platform/utilities/data/set';
import { requestStates } from '../../../../platform/utilities/constants';
import { itfStatuses } from '../constants';
import {
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../actions';

const initialState = {
  fetchCallState: requestStates.notCalled,
  creationCallState: requestStates.notCalled,
  currentITF: null,
  previousITF: null,
};

/**
 * Finds the last ITF with a given status
 *
 * Note: This can return undefined
 */
function findLastITF(itfList) {
  return itfList.sort(
    (a, b) => new Date(b.expirationDate) - new Date(a.expirationDate),
  )[0];
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ITF_FETCH_INITIATED:
      return set('fetchCallState', requestStates.pending, state);
    case ITF_FETCH_SUCCEEDED: {
      const newState = set('fetchCallState', requestStates.succeeded, state);

      // The full list is potentially more than just compensation ITFs, but we don't need those
      const itfList = get('attributes.intentToFile', action.data).filter(
        i => i.type === 'compensation',
      );
      const activeITF = itfList.find(i => i.status === itfStatuses.active);

      // Set the curentITFStatus
      if (activeITF) {
        // Pulled the active ITF out like this in case it's not technically the latest (not sure that's possible, though)
        newState.currentITF = activeITF;
        return newState;
      }

      // No active ITF found; use the one with the last expiration date
      newState.currentITF = findLastITF(itfList);

      return newState;
    }
    case ITF_FETCH_FAILED:
      return set('fetchCallState', requestStates.failed, state);
    case ITF_CREATION_INITIATED:
      return set('creationCallState', requestStates.pending, state);
    case ITF_CREATION_SUCCEEDED: {
      const newState = set('creationCallState', requestStates.succeeded, state);
      newState.previousITF = state.currentITF;
      newState.currentITF = action.data.attributes.intentToFile;
      return newState;
    }
    case ITF_CREATION_FAILED:
      return set('creationCallState', requestStates.failed, state);
    default:
      return state;
  }
};
