// dependencies
import moment from 'moment';

// relative imports
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
  // stayPut keeps both indexA and indexB right where they are.
  const [
    ALPHA_ASCENDING,
    ALPHA_DESCENDING,
    LAST_UPDATED_NEWEST_OPTION,
    LAST_UPDATED_OLDEST_OPTION,
  ] = SORT_OPTIONS;
  const sortIndexToFront = -1;
  const sortIndexToBack = 1;
  const indexRemainsInPlace = 0;
  const latestTimeStampIndexA = deriveLatestIssue(
    indexA.attributes.firstIssuedOn,
    indexA.attributes.lastRevisionOn,
  );
  const latestTimeStampIndexB = deriveLatestIssue(
    indexB.attributes.firstIssuedOn,
    indexB.attributes.lastRevisionOn,
  );

  // SORT BY DATE
  if (
    sortByPropertyName === LAST_UPDATED_OLDEST_OPTION ||
    sortByPropertyName === LAST_UPDATED_NEWEST_OPTION
  ) {
    return sortByPropertyName === LAST_UPDATED_OLDEST_OPTION
      ? moment(latestTimeStampIndexA, 'MM-DD-YYYY').toDate() - // DESCENDING
          moment(latestTimeStampIndexB, 'MM-DD-YYYY').toDate()
      : moment(latestTimeStampIndexB, 'MM-DD-YYYY').toDate() - // ASCENDING
          moment(latestTimeStampIndexA, 'MM-DD-YYYY').toDate();
  }

  // SORT BY ALPHABET
  if (
    sortByPropertyName === ALPHA_ASCENDING ||
    sortByPropertyName === ALPHA_DESCENDING
  ) {
    if (
      `${indexA?.attributes?.formName} ${indexA?.attributes?.title}` <
      `${indexB?.attributes?.formName} ${indexB?.attributes?.title}`
    ) {
      return sortByPropertyName === ALPHA_ASCENDING
        ? sortIndexToFront
        : sortIndexToBack;
    } else if (
      `${indexA?.attributes?.formName} ${indexA?.attributes?.title}` >
      `${indexB?.attributes?.formName} ${indexB?.attributes?.title}`
    ) {
      return sortByPropertyName === ALPHA_ASCENDING
        ? sortIndexToBack
        : sortIndexToFront;
    }
  }

  return indexRemainsInPlace;
};
