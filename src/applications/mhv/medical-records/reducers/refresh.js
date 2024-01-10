import { Actions } from '../util/actionTypes';
import {
  EXTRACT_LIST,
  VALID_REFRESH_DURATION,
  refreshPhases,
} from '../util/constants';

const initialState = {
  /** The overall phase of the PHR refresh (stale, in progress, current, or failed) */
  phase: undefined,

  /** The retrieved date from the PHR status response (date from server) */
  statusDate: undefined,

  /** The list of extract statuses from the PHR status response */
  status: undefined,

  /** The final 'completed' date of the overall refresh (date from server) */
  dateCompleted: undefined,
};

export const safeNewDate = dateStr => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? null : date;
};

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
  if (extractStatus.lastCompleted < extractStatus.lastRequested) {
    return refreshPhases.IN_PROGRESS;
  }
  if (extractStatus.lastCompleted !== extractStatus.lastSuccessfulCompleted) {
    return refreshPhases.FAILED;
  }
  return refreshPhases.CURRENT;
};

/**
 * Determine the overall phase for a PHR refresh, based on the phases of each component extract.
 * The highest-priority extract phase takes precedence. For example, if one extract phase is
 * IN_PROGRESS, then the overall status is IN_PROGRESS.
 *
 * @param {Object} refreshStatus the list of individual extract statuses
 * @returns the current overall refresh phase, or null if needed data is missing
 */
export const getOverallPhase = (refreshStatus, retrieved) => {
  if (!refreshStatus || refreshStatus.length === 0) {
    return null;
  }

  const phaseList = refreshStatus
    .filter(status => EXTRACT_LIST.includes(status.extract))
    .map(status => getPhase(status, retrieved));

  const phasePriority = [
    refreshPhases.IN_PROGRESS,
    refreshPhases.STALE,
    refreshPhases.CURRENT,
    refreshPhases.FAILED,
  ];

  for (const phase of phasePriority) {
    if (phaseList.includes(phase)) {
      return phase;
    }
  }
  return null;
};

/**
 * Looks at all of the extracts within the PHR refresh status and returns the date of the one that
 * was completed most recently.
 *
 * @param {*} statusList the list of individual extract statuses
 * @returns the max lastCompleted date of the status
 */
export const refreshCompleted = statusList => {
  const timestamps = statusList
    .filter(
      status => EXTRACT_LIST.includes(status.extract) && status.lastCompleted,
    )
    .map(status => status.lastCompleted);
  if (timestamps.length === 0) return null;
  return new Date(Math.max(...timestamps));
};

export const refreshReducer = (state = initialState, action) => {
  // We currently only have one action for this reducer. This may change.
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case Actions.Refresh.GET_STATUS: {
      const { facilityExtractStatusList } = action.payload;
      return {
        ...state,
        phase: getOverallPhase(
          facilityExtractStatusList,
          action.payload.retrievedDate,
        ),
        statusDate: safeNewDate(action.payload.retrievedDate),
        status: facilityExtractStatusList.map(statusRec => {
          return {
            extract: statusRec.extract,
            lastRequested: safeNewDate(statusRec.lastRequested),
            lastCompleted: safeNewDate(statusRec.lastCompleted),
            phase: getPhase(statusRec, action.payload.retrievedDate),
          };
        }),
        dateCompleted: safeNewDate(refreshCompleted(facilityExtractStatusList)),
      };
    }
    default:
      return state;
  }
};
