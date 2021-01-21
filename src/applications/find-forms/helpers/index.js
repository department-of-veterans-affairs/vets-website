import { deriveLatestIssue } from '../components/SearchResult';
import { SORT_OPTIONS } from '../constants';

/**
 * This function sorts the results of Find Forms search.
 * @param {string} sortByPropertyName Is the state property in the SearchResults Controller
 * @param {object} indexA Is a Search Result returned.
 * @param {object} indexB Is a Search Result returned.
 */

export const sortTheResults = (sortByPropertyName, indexA, indexB) => {
  // -n (negative number) sorts indexA to the front of the array.
  // n (positive number) sorts indexA to the back of the array.
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

  // DESCENDING
  if (sortByPropertyName === LAST_UPDATED_NEWEST_OPTION) {
    return new Date(latestTimeStampIndexB) - new Date(latestTimeStampIndexA);
  }

  // ASCENDING
  if (sortByPropertyName === LAST_UPDATED_OLDEST_OPTION) {
    return new Date(latestTimeStampIndexA) - new Date(latestTimeStampIndexB);
  }

  return 0;
};
