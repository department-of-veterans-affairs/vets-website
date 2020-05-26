// Node modules.
import URLSearchParams from 'url-search-params';
import filter from 'lodash/filter';
import map from 'lodash/map';
// Relative imports.
import MOCK_RESULTS from '../api/stub';

export const createMockResults = (category, platform) => {
  const data = filter(MOCK_RESULTS.data, result => {
    if (category && !result.attributes.categories.includes(category)) {
      return false;
    }

    if (platform && !result.attributes.platforms.includes(platform)) {
      return false;
    }

    return true;
  });

  return {
    data,
    meta: {
      count: data.length,
    },
  };
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
