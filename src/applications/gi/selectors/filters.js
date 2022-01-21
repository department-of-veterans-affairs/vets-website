import _ from 'lodash';
import { INITIAL_STATE } from '../reducers/filters';

// default state is checked so these will only be present if their corresponding boxes are unchecked
export const FILTERS_EXCLUDED_FLIP = ['schools', 'employers', 'vettec'];
export const FILTERS_IGNORE_ALL = ['country', 'state', 'specialMission'];

// The exclude filters are seen as includes so we're flipping them to match their presentation
export const FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP =
  INITIAL_STATE.excludedSchoolTypes;

const omitNonFilters = filters => _.omit(filters, ['expanded', 'search']);

export const getFiltersChanged = filters => {
  return !_.isEqual(omitNonFilters(filters), omitNonFilters(INITIAL_STATE));
};

export const buildSearchFilters = filters => {
  const clonedFilters = _.cloneDeep(filters);
  delete clonedFilters.expanded;
  delete clonedFilters.search;

  const searchFilters = {};

  // boolean fields
  Object.entries(clonedFilters)
    .filter(([_field, value]) => value === true)
    .filter(([field, _value]) => !FILTERS_EXCLUDED_FLIP.includes(field))
    .forEach(([field]) => {
      searchFilters[field] = clonedFilters[field];
    });

  FILTERS_IGNORE_ALL.filter(field => clonedFilters[field] !== 'ALL').forEach(
    field => {
      searchFilters[field] = clonedFilters[field];
    },
  );

  FILTERS_EXCLUDED_FLIP.filter(field => !clonedFilters[field]).forEach(
    field => {
      const excludeField = `exclude${field[0].toUpperCase() +
        field.slice(1).toLowerCase()}`;
      searchFilters[excludeField] = !clonedFilters[field];
    },
  );

  clonedFilters.excludedSchoolTypes = FILTERS_SCHOOL_TYPE_EXCLUDE_FLIP.filter(
    exclusion => !clonedFilters.excludedSchoolTypes.includes(exclusion),
  );

  if (clonedFilters.excludedSchoolTypes.length > 0) {
    searchFilters.excludedSchoolTypes = clonedFilters.excludedSchoolTypes;
  }

  return searchFilters;
};
