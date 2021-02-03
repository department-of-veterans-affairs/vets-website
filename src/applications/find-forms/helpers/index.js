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

  /**
   * This function converts string to js date so it can properly sort using the js date object
   * @param {string} date string
   */
  const makeMomentDateFriendlyToJSDateConstrcutor = date => {
    if (date === 'N/A') {
      // catch all, if date is N/A from deriveLatestIssue() ,
      // Date constructor returns Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time) when null is passed as a parameter
      return null;
    }
    const splitDate = date.split('-');
    const [month, day, year] = splitDate;
    return new Date(year, month, day);
  };

  // DESCENDING
  if (sortByPropertyName === LAST_UPDATED_NEWEST_OPTION) {
    return (
      makeMomentDateFriendlyToJSDateConstrcutor(latestTimeStampIndexB) -
      makeMomentDateFriendlyToJSDateConstrcutor(latestTimeStampIndexA)
    );
  }

  // ASCENDING
  if (sortByPropertyName === LAST_UPDATED_OLDEST_OPTION) {
    return (
      makeMomentDateFriendlyToJSDateConstrcutor(latestTimeStampIndexA) -
      makeMomentDateFriendlyToJSDateConstrcutor(latestTimeStampIndexB)
    );
  }
  return 0;
};
