/**
 * This module provides mock helper functions for simulating PHR (Personal Health Record)
 * refresh scenarios in tests for the MHV Medical Records application.
 * It emulates backend status and data responses to facilitate frontend testing of different
 * refresh states and behaviors.
 */
import { refreshExtractTypes } from './constants';

// Controls which mock scenario is returned by `mockGetRefreshStatus` and `mockGetData`
// Change this value to simulate different test cases.
const scenario = 4;
const extractType = refreshExtractTypes.VPR;

// Scenario descriptions:
// 1 = Simulates a refresh timeout with stale data (FAILED)
// 2 = Simulates a refresh that has already completed successfully (GRAY BAR)
// 3 = Simulates a refresh currently in progress with no new records (GREEN BAR)
// 4 = Simulates a refresh currently in progress with new records found (BLUE BAR)
// 5 = Simulates a refresh in progress that ultimately fails (failure from Vista) (FAILED)
// 6 = Simulates a stale refresh where the last successful completion was over 2 minutes ago (GRAY BAR)

const beginDate = new Date();

// Returns a timestamp representing the given number of minutes before the provided date.
const minutesAgo = (date, minutes) => {
  return new Date(date.getTime() - minutes * 60 * 1000).getTime();
};

// Returns true if the elapsed time since `beginDate` exceeds the given number of seconds.
const trueElapsed = seconds => {
  const currentTime = new Date().getTime();
  const givenTime = beginDate.getTime();
  return currentTime - givenTime > seconds * 1000;
};

/**
 * Generates a mock facility status response object with provided time offsets.
 * @param {number} retrieved - Minutes ago that the data was retrieved.
 * @param {number} requested - Minutes ago that the refresh was requested.
 * @param {number} completed - Minutes ago that the refresh was completed.
 * @param {number} successful - Minutes ago that the refresh successfully completed.
 */
const mockStatusResponse = (retrieved, requested, completed, successful) => {
  const now = new Date();
  return {
    retrievedDate: minutesAgo(now, retrieved),
    lastRefreshDate: null,
    facilityExtractStatusList: [
      {
        extract: extractType,
        lastRequested: minutesAgo(now, requested),
        lastCompleted: minutesAgo(now, completed),
        lastSuccessfulCompleted: minutesAgo(now, successful),
      },
    ],
  };
};

// STALE = retrieved > completed + 1 hour
// IN_PROGRESS = requested > completed
// FAILED = completed != successful
// CURRENT = none of the above hold
// params: retrieved, requested, completed, successful
const STALE = mockStatusResponse(0, 1, 70, 70);
const IN_PROGRESS = mockStatusResponse(0, 1, 20, 20);
const FAILED = mockStatusResponse(0, 10, 5, 80);
const CURRENT = mockStatusResponse(0, 10, 5, 5);
const STALE_AND_TIMED_OUT = mockStatusResponse(0, 3, 70, 70);

/**
 * Returns a mock status object simulating different backend states based on the selected scenario.
 */
export const mockGetRefreshStatus = () => {
  switch (scenario) {
    case 1: {
      return STALE;
    }
    case 2: {
      return CURRENT;
    }
    case 5: {
      if (trueElapsed(4)) {
        return FAILED;
      }
      if (trueElapsed(2)) {
        return IN_PROGRESS;
      }
      return STALE;
    }
    case 6: {
      return STALE_AND_TIMED_OUT;
    }
    case 3:
    case 4:
    default: {
      if (trueElapsed(4)) {
        return CURRENT;
      }
      if (trueElapsed(2)) {
        return IN_PROGRESS;
      }
      return STALE;
    }
  }
};

/**
 * Returns a mock response representing the data returned from the API,
 * based on the current scenario and elapsed time.
 * @param {Object} response - The full mock response object.
 * @param {boolean} dataType - Indicates the format of the incoming data (array, fhir, simplified).
 */
export const mockGetData = (response, dataType) => {
  let oneRecord;
  if (dataType === 'array') oneRecord = [response[0]];
  else if (dataType === 'fhir')
    oneRecord = { ...response, entry: [response.entry[0]] };
  else if (dataType === 'simplified')
    oneRecord = {
      ...response,
      data: [response.data[0]],
      meta: {
        ...response.meta,
        pagination: {
          currentPage: 1,
          perPage: 10,
          totalPages: 1,
          totalEntries: 1,
        },
      },
    };
  else throw new Error('Invalid data type');

  switch (scenario) {
    case 4:
      if (trueElapsed(2)) {
        return response;
      }
      return oneRecord;
    case 1:
    case 2:
    case 3:
    case 5:
    default:
      return oneRecord;
  }
};
