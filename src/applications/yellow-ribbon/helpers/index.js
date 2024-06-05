// Node modules.
import URLSearchParams from 'url-search-params';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import { TITLE_CASE_NONCAPITALIZED_WORDS } from '../constants';

export const capitalize = str => startCase(toLower(str));

export const titleCase = str => {
  const nonCapitalizedWords = new Set(TITLE_CASE_NONCAPITALIZED_WORDS);

  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word, index, words) => {
      if (
        index !== 0 &&
        index !== words.length - 1 &&
        nonCapitalizedWords.has(word)
      ) {
        return word;
      }
      return word
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-');
    })
    .join(' ');
};

export const normalizeResponse = response => ({
  results: map(response?.data, school => ({
    ...school?.attributes,
    id: school?.id,
    type: school?.type,
  })),
  totalResults: response?.meta?.count,
});

export const updateQueryParams = (
  history = window.history,
  location = window.location,
  queryParamsLookup = {},
) => {
  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Set/Delete query params.
  Object.entries(queryParamsLookup).forEach(([key, value]) => {
    // Set the query param.
    if (value) {
      queryParams.set(key, value);
      return;
    }

    // Remove the query param.
    queryParams.delete(key);
  });

  // Update the URL with the new query params.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);
};

// Function to change the academic year automatically each year on August 1st.
export const getCurrentAcademicYear = (now = new Date()) => {
  const year = now.getFullYear();
  const month = now.getMonth(); // January is 0. So August is 7;

  if (month >= 7) {
    return `${year} to ${year + 1}`;
  }

  return `${year - 1} to ${year}`;
};
