import {
  LOAD_SCHOOLS_FAILED,
  LOAD_SCHOOLS_STARTED,
  LOAD_SCHOOLS_SUCCEEDED,
  SEARCH_CLEARED,
  SEARCH_INPUT_CHANGED,
  INSTITUTION_SELECTED
} from '../actions/schoolSearch';
import _ from 'lodash';

const initialState = {
  address1: '',
  address2: '',
  address3: '',
  currentPageNumber: 1,
  institutions: [],
  institutionQuery: '',
  institutionSelected: {},
  pagesCount: 0,
  searchInputValue: '',
  searchResultsCount: 0,
  showInstitutions: false,
  showInstitutionsLoading: false,
  showNoResultsFound: false,
  showPagination: false,
  showPaginationLoading: false
};

export default function schoolSearch(state = initialState, action) {
  switch (action.type) {
    case INSTITUTION_SELECTED: {
      const {
        city,
        facilityCode,
        name,
        state: institutionState
      } = action;

      return {
        ...state,
        institutionSelected: {
          city,
          facilityCode,
          name,
          state: institutionState
        }
      };
    }
    case LOAD_SCHOOLS_FAILED: {
      const currentPageNumber = 0;
      const institutionSelected = {};
      const institutionQuery = action.institutionQuery;
      const institutions = [];
      const pagesCount = 0;
      const searchResultsCount = 0;
      const showInstitutions = false;
      const showInstitutionsLoading = false;
      const showNoResultsFound = true;
      const showPagination = false;
      const showPaginationLoading = false;

      return {
        ...state,
        currentPageNumber,
        institutionQuery,
        institutions,
        institutionSelected,
        pagesCount,
        searchResultsCount,
        showInstitutions,
        showInstitutionsLoading,
        showNoResultsFound,
        showPagination,
        showPaginationLoading
      };
    }
    case LOAD_SCHOOLS_STARTED: {
      const currentPageNumber = action.page ? action.page : 1;
      const institutionQuery = action.institutionQuery;
      const institutions = [];
      const institutionSelected = {};
      const searchResultsCount = action.page ? state.searchResultsCount : 0;
      const showInstitutions = false;
      const showInstitutionsLoading = !action.page;
      const showNoResultsFound = false;
      const showPagination = action.page ? action.page > 1 : false;
      const showPaginationLoading = !!action.page;

      return {
        ...state,
        currentPageNumber,
        institutionQuery,
        institutions,
        institutionSelected,
        searchResultsCount,
        showInstitutions,
        showInstitutionsLoading,
        showNoResultsFound,
        showPagination,
        showPaginationLoading
      };
    }

    case LOAD_SCHOOLS_SUCCEEDED: {
      const {
        data = [],
        meta
      } = action.payload;

      const searchResultsCount = meta.count;

      const institutionQuery = action.institutionQuery;
      const institutions = data.map(({ attributes }) => {
        // pull only necessary attributes from response
        const { address1, address2, address3, city, country, facilityCode, name, state: institutionState, zip } = attributes;
        return {
          address1,
          address2,
          address3,
          city,
          country,
          facilityCode,
          name,
          state: institutionState,
          zip
        };
      }).map(institution => _.reduce(institution, (result, value, key) => {
        // transform null to empty string
        result[key] = value || ''; // eslint-disable-line no-param-reassign
        return result;
      }, {}));
      const pagesCount = Math.ceil(searchResultsCount / 10);
      const showInstitutions = institutions.length > 0;
      const showInstitutionsLoading = false;
      const showNoResultsFound = institutions.length < 1;
      const showPagination = pagesCount > 1;
      const showPaginationLoading = false;

      return {
        ...state,
        institutionQuery,
        institutions,
        pagesCount,
        searchResultsCount,
        showInstitutions,
        showInstitutionsLoading,
        showNoResultsFound,
        showPagination,
        showPaginationLoading
      };
    }

    case SEARCH_CLEARED: {
      return initialState;
    }

    case SEARCH_INPUT_CHANGED: {
      return {
        ...state,
        searchInputValue: action.searchInputValue
      };
    }

    default:
      return state;
  }
}
