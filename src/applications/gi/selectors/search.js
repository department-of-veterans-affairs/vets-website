import _ from 'lodash';
import appendQuery from 'append-query';
import { INITIAL_STATE } from '../reducers/search';
import { buildSearchFilters } from './filters';

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
    searchQuery.name !== undefined &&
    queryParams.search === 'name'
  ) {
    queryParams.name = searchQuery.name;
  }

  if (
    searchQuery.location !== '' &&
    searchQuery.location !== null &&
    searchQuery.location !== undefined &&
    queryParams.search === 'location'
  ) {
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
