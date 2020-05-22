// Node modules.
import URLSearchParams from 'url-search-params';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

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
