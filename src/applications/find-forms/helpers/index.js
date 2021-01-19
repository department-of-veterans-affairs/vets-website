import { deriveLatestIssue } from '../components/SearchResult';
import { SORT_OPTIONS } from '../constants';

/**
 * This function sorts the results of Find Forms search.
 * @param {string} howToSort Is the state property in the SearchResults Controller
 * @param {object} indexA Is a Search Result returned.
 * @param {object} indexB Is a Search Result returned.
 */

export const sortTheResults = (howToSort, indexA, indexB) => {
  // -1 sorts indexA to the front of the array.
  // 1 sorts indexA to the back of the array.
  // 0 keeps both indexA and indexB right where they are.
  const [LAST_UPDATED_NEWEST_OPTION, LAST_UPDATED_OLDEST_OPTION] = SORT_OPTIONS;

  const latestTimeStampIndexA = deriveLatestIssue(
    indexA.attributes.firstIssuedOn,
    indexA.attributes.lastRevisionOn,
  );

  const latestTimeStampIndexB = deriveLatestIssue(
    indexB.attributes.firstIssuedOn,
    indexB.attributes.lastRevisionOn,
  );

  const newestDate = deriveLatestIssue(
    latestTimeStampIndexA,
    latestTimeStampIndexB,
  );

  const oldestDate =
    latestTimeStampIndexA === newestDate
      ? latestTimeStampIndexB
      : latestTimeStampIndexA;

  if (howToSort === LAST_UPDATED_NEWEST_OPTION) {
    if (newestDate === latestTimeStampIndexA) return -1;
    else if (newestDate === latestTimeStampIndexB) return 1;
  }

  if (howToSort === LAST_UPDATED_OLDEST_OPTION) {
    if (oldestDate === latestTimeStampIndexA) return -1;
    else if (oldestDate === latestTimeStampIndexB) return 1;
  }

  return 0;
};
