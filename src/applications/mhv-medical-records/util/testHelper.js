import { refreshExtractTypes } from './constants';

const scenario = 4;
const extractType = refreshExtractTypes.VPR;
// 1 = Refresh times out with stale data (FAILED)
// 2 = Refresh already happened (GRAY BAR)
// 3 = Refresh in progress, no new records (GREEN BAR)
// 4 = Refresh in progress, new records found (BLUE BAR)
// 5 = Refresh in progress, failed from Vista (FAILED)
// 6 = Refresh has stale data, but the refresh happened > 2 minutes ago (GRAY BAR)

const beginDate = new Date();

const minutesAgo = (date, minutes) => {
  return new Date(date.getTime() - minutes * 60 * 1000).getTime();
};

const trueElapsed = seconds => {
  const currentTime = new Date().getTime();
  const givenTime = beginDate.getTime();
  return currentTime - givenTime > seconds * 1000;
};

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
const STALE = mockStatusResponse(0, 1, 70, 70);
const IN_PROGRESS = mockStatusResponse(0, 1, 20, 20);
const FAILED = mockStatusResponse(0, 10, 5, 80);
const CURRENT = mockStatusResponse(0, 10, 5, 5);
const STALE_AND_TIMED_OUT = mockStatusResponse(0, 3, 70, 70);

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

export const mockGetData = (response, isMhvData) => {
  let oneRecord;
  if (isMhvData) oneRecord = [response[0]];
  else oneRecord = { entry: [response.entry[0]] };

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
