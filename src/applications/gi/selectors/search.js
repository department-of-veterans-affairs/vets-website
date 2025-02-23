import _ from 'lodash';
import appendQuery from 'append-query';
import { INITIAL_STATE } from '../reducers/search';
import {
  FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP,
  buildSearchFilters,
} from './filters';
import { managePushHistory, setDocumentTitle } from '../utils/helpers';
import { TABS } from '../constants';

export const getSearchQueryChanged = query => {
  return !_.isEqual(query, INITIAL_STATE.query);
};

const getCleanPathName = history => {
  if (history?.location?.pathname) {
    const { pathname } = history.location;
    return pathname.replace(/\/$/, '');
  }
  return '';
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
    searchQuery.name &&
    queryParams.search === TABS.schoolAndEmployerPrograms
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

  let url = appendQuery('/', {
    ...queryParams,
    ...ClonedBuildSearchFilters,
  });

  if (
    tab === TABS.schoolAndEmployerPrograms ||
    tab === TABS.schoolAndEmployerName
  ) {
    const pathName = getCleanPathName(history);
    url = `${pathName}${url}`;
  }

  managePushHistory(history, url);
  setDocumentTitle();
};
