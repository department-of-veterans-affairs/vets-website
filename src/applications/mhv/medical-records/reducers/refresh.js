import { Actions } from '../util/actionTypes';
import {
  EXTRACT_LIST,
  VALID_REFRESH_DURATION,
  refreshPhases,
} from '../util/constants';

const initialState = {
  refreshPhase: undefined,
  statusDate: undefined,
  status: undefined,
};

const safeNewDate = dateStr => (dateStr ? new Date(dateStr) : null);

/**
 * Determine whether the PHR refresh for a particular extract is stale, in progress, current, or failed.
 *
 * @param {Object} extractStatus the chunk of the status response for a particular extract
 * @param {number} retrieved the timestamp (in ms) that the refresh status was retrieved
 * @returns {string|null} the current refresh phase, or null if parameters are invalid.
 */
export const getPhase = (extractStatus, retrieved) => {
  if (
    !extractStatus?.lastRequested ||
    !extractStatus?.lastCompleted ||
    !extractStatus?.lastSuccessfulCompleted ||
    !retrieved
  ) {
    return null;
  }
  if (retrieved - extractStatus.lastCompleted > VALID_REFRESH_DURATION) {
    return refreshPhases.STALE;
  }
  if (extractStatus.lastCompleted < extractStatus.lastRequestedsted) {
    return refreshPhases.IN_PROGRESS;
  }
  if (extractStatus.lastCompleted !== extractStatus.lastSuccessfulCompleted) {
    return refreshPhases.FAILED;
  }
  return refreshPhases.CURRENT;
};

const getOverallPhase = refreshStatus => {
  if (!refreshStatus || refreshStatus.length === 0) {
    return null;
  }
  let anyInProgress = false;
  let anyStale = false;
  let anyCurrent = false;
  let anyFailed = false;
  refreshStatus
    .filter(status => EXTRACT_LIST.includes(status.extract))
    .forEach(status => {
      anyInProgress =
        anyInProgress || status.phase === refreshPhases.IN_PROGRESS;
      anyStale = anyStale || status.phase === refreshPhases.STALE;
      anyCurrent = anyCurrent || status.phase === refreshPhases.CURRENT;
      anyFailed = anyFailed || status.phase === refreshPhases.FAILED;
    });
  if (anyInProgress) return refreshPhases.IN_PROGRESS;
  if (anyStale) return refreshPhases.STALE;
  if (anyCurrent) return refreshPhases.CURRENT;
  if (anyFailed) return refreshPhases.FAILED;
  return null;
};

export const refreshReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Refresh.GET_STATUS: {
      const { facilityExtractStatusList } = action.payload;
      return {
        ...state,
        statusDate: safeNewDate(action.payload.retrievedDate),
        status: facilityExtractStatusList.map(statusRec => {
          return {
            extract: statusRec.extract,
            lastRequested: safeNewDate(statusRec.lastRequested),
            lastCompleted: safeNewDate(statusRec.lastCompleted),
            phase: getPhase(statusRec, action.payload.retrievedDate),
          };
        }),
      };
    }
    case Actions.Refresh.UPDATE_PHASE: {
      return {
        ...state,
        phase: getOverallPhase(action.payload),
      };
    }
    default:
      return state;
  }
};
