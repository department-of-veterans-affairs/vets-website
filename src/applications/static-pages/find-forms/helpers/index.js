import { parse, compareAsc } from 'date-fns';
import { deriveLatestIssue } from '../components/SearchResult';
import {
  FAF_SORT_OPTIONS,
  FORM_MOMENT_PRESENTATION_DATE_FORMAT,
} from '../constants';
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
    CLOSEST_MATCH,
    ALPHA_ASCENDING,
    ALPHA_DESCENDING,
    LAST_UPDATED_NEWEST_OPTION,
    LAST_UPDATED_OLDEST_OPTION,
  ] = FAF_SORT_OPTIONS;
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

  // CLOSEST MATCH
  if (sortByPropertyName === CLOSEST_MATCH) {
    return indexRemainsInPlace;
  }

  // SORT BY DATE
  if (
    sortByPropertyName === LAST_UPDATED_OLDEST_OPTION ||
    sortByPropertyName === LAST_UPDATED_NEWEST_OPTION
  ) {
    const dateA = parse(
      latestTimeStampIndexA,
      FORM_MOMENT_PRESENTATION_DATE_FORMAT,
      new Date(),
    );
    const dateB = parse(
      latestTimeStampIndexB,
      FORM_MOMENT_PRESENTATION_DATE_FORMAT,
      new Date(),
    );

    const dateComparison = compareAsc(dateA, dateB);

    return sortByPropertyName === LAST_UPDATED_OLDEST_OPTION
      ? dateComparison // Oldest first (ascending)
      : -dateComparison; // Newest first (descending)
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
    }
    if (
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

export const filterDeletedForms = forms => {
  if (!forms) {
    return [];
  }
  return forms.filter(form => !form.attributes.deletedAt);
};
