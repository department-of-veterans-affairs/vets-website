/* eslint-disable sonarjs/no-collapsible-if */
import _ from 'lodash';
import { INITIAL_STATE } from '../reducers/search';
import appendQuery from 'append-query';
import { buildSearchFilters } from './filters';
import environment from 'platform/utilities/environment';

export const getSearchQueryChanged = query => {
  return !_.isEqual(query, INITIAL_STATE.query);
};

export const updateUrlParams = (
  history,
  tab,
  searchQuery,
  filters,
  version,
) => {
  const queryParams = {
    search: tab,
  };

  if (
    searchQuery.name !== '' &&
    searchQuery.name !== null &&
    searchQuery.name !== undefined
  ) {
    if (environment.isProduction() || queryParams.name === 'name')
      queryParams.name = searchQuery.name;
  }

  if (
    searchQuery.location !== '' &&
    searchQuery.location !== null &&
    searchQuery.location !== undefined
  ) {
    if (environment.isProduction() || queryParams.name === 'location')
      queryParams.location = searchQuery.location;
  }

  if (version) {
    queryParams.version = version;
  }

  const url = appendQuery('/', {
    ...queryParams,
    ...buildSearchFilters(filters),
  });

  history.push(url);

  document.title = `Search results: GI Bill® Comparison Tool | Veterans Affairs`;
};
