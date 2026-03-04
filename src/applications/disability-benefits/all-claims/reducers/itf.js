import set from 'platform/utilities/data/set';
import { requestStates } from 'platform/utilities/constants';
import { itfStatuses } from '../constants';
import { isNotExpired } from '../utils';
import {
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
  ITF_MESSAGE_DISMISSED,
} from '../actions';

const initialState = {
  fetchCallState: requestStates.notCalled,
  creationCallState: requestStates.notCalled,
  currentITF: null,
  previousITF: null,
  messageDismissed: false,
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
      newState.currentITF = null;

      // The full list is potentially more than just compensation ITFs, but we
      // don't need those
      const itfList = (action.data?.attributes?.intentToFile || []).filter(
        i => i.type === 'compensation',
      );
      const activeITF = itfList.find(i => i.status === itfStatuses.active);
      const latestITF = findLastITF(itfList);

      if (activeITF?.expirationDate) {
        // Pulled the active ITF out like this in case it's not technically the
        // latest (not sure that's possible, though)
        if (isNotExpired(activeITF.expirationDate)) {
          newState.currentITF = activeITF;
        } else {
          newState.previousITF = activeITF;
        }
      }
      if (!newState.currentITF && latestITF?.expirationDate) {
        if (isNotExpired(latestITF.expirationDate)) {
          newState.currentITF = latestITF;
        } else {
          newState.previousITF = latestITF;
        }
      }
      return newState;
    }
    case ITF_FETCH_FAILED:
      return set('fetchCallState', requestStates.failed, state);
    case ITF_CREATION_INITIATED:
      return set('creationCallState', requestStates.pending, state);
    case ITF_CREATION_SUCCEEDED: {
      const newState = set('creationCallState', requestStates.succeeded, state);
      newState.previousITF = state.currentITF || state.previousITF;
      newState.currentITF = action.data.attributes.intentToFile;
      return newState;
    }
    case ITF_CREATION_FAILED:
      return set('creationCallState', requestStates.failed, state);
    case ITF_MESSAGE_DISMISSED:
      return set('messageDismissed', true, state);
    default:
      return state;
  }
};
