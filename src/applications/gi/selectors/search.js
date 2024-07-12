import _ from 'lodash';
import appendQuery from 'append-query';
import { INITIAL_STATE } from '../reducers/search';
import {
  FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP,
  buildSearchFilters,
} from './filters';
import { managePushHistory, setDocumentTitle } from '../utils/helpers';

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
  const clonedFilters = FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP.filter(
    exclusion =>
      !buildSearchFilters(filters).excludedSchoolTypes?.includes(exclusion),
  );
  const ClonedBuildSearchFilters =
    tab === 'location'
      ? { ...buildSearchFilters(filters), excludedSchoolTypes: clonedFilters }
      : buildSearchFilters(filters);
  const url = appendQuery('/', {
    ...queryParams,
    ...ClonedBuildSearchFilters,
  });

  managePushHistory(history, url);
  setDocumentTitle();
};
