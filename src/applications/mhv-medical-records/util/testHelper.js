import phrTestOneItem from '../tests/fixtures/phrRefreshGuiTestOneItem.json';
import phrTestTwoItems from '../tests/fixtures/phrRefreshGuiTestTwoItems.json';

// This is a file for manually testing/demoing the PHR Refresh GUI flow.

const scenario = 5;
// 1 = Refresh times out with stale data (FAILED)
// 2 = Refresh already happened (GRAY BAR)
// 3 = Refresh in progress, no new records (GREEN BAR)
// 4 = Refresh in progress, new records found (BLUE BAR)
// 5 = Refresh in progress, failed from Vista (FAILED)

const beginDate = new Date();

const minutesAgo = (date, minutes) => {
  return new Date(date.getTime() - minutes * 60 * 1000);
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
        extract: 'VPR',
        lastRequested: minutesAgo(now, requested),
        lastCompleted: minutesAgo(now, completed),
        lastSuccessfulCompleted: minutesAgo(now, successful),
      },
    ],
  };
};

export const mockGetRefreshStatus = () => {
  switch (scenario) {
    case 1: {
      return mockStatusResponse(0, 80, 70, 70); // STALE
    }
    case 2: {
      return mockStatusResponse(0, 10, 5, 5); // CURRENT
    }
    case 5: {
      if (trueElapsed(8)) {
        return mockStatusResponse(0, 10, 5, 80); // FAILED
      }
      if (trueElapsed(4)) {
        return mockStatusResponse(0, 10, 20, 20); // IN PROGRESS
      }
      return mockStatusResponse(0, 80, 70, 70); // STALE
    }
    case 3:
    case 4:
    default: {
      if (trueElapsed(8)) {
        return mockStatusResponse(0, 10, 5, 5); // CURRENT
      }
      if (trueElapsed(4)) {
        return mockStatusResponse(0, 10, 20, 20); // IN PROGRESS
      }
      return mockStatusResponse(0, 80, 70, 70); // STALE
    }
  }
};

export const mockGetNotes = () => {
  switch (scenario) {
    case 4:
      if (trueElapsed(2)) {
        return phrTestTwoItems;
      }
      return phrTestOneItem;
    case 1:
    case 2:
    case 3:
    case 5:
    default:
      return phrTestOneItem;
  }
};
