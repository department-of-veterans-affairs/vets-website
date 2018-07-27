import {
  LOAD_SCHOOLS_STARTED,
  LOAD_SCHOOLS_SUCCEEDED,
  // LOAD_SCHOOLS_FAILED,
  SEARCH_INPUT_CHANGE,
  SELECT_INSTITUTION
} from '../actions/schoolSearch';

const initialState = {
  currentPageNumber: 1,
  institutions: [],
  institutionQuery: '',
  institutionSelected: {},
  pagesCount: 0,
  searchInputValue: '',
  searchResultsCount: 0,
  showInstitutions: false,
  showInstitutionsLoading: false,
  showPagination: false,
  showPaginationLoading: false
};

export default function schoolSearch(state = initialState, action) {
  switch (action.type) {
    case LOAD_SCHOOLS_STARTED: {
      const currentPageNumber = action.page ? action.page : 1;
      const institutionQuery = action.institutionQuery;
      const institutions = [];
      const institutionSelected = {};
      const searchResultsCount = action.page ? state.searchResultsCount : 0;
      const showInstitutions = false;
      const showInstitutionsLoading = !action.page;
      const showPagination = action.page ? action.pagesCount > 1 : false;
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
        const { city, country, facilityCode, name, state: institutionState, zip } = attributes;
        return { city, country, facilityCode, name, state: institutionState, zip };
      });
      const pagesCount = Math.ceil(searchResultsCount / 10);
      const showInstitutions = true;
      const showInstitutionsLoading = false;
      const showPagination = pagesCount > 1;
      const showPaginationLoading = !!action.page;

      return {
        ...state,
        institutionQuery,
        institutions,
        pagesCount,
        searchResultsCount,
        showInstitutions,
        showInstitutionsLoading,
        showPagination,
        showPaginationLoading
      };
    }

    case SEARCH_INPUT_CHANGE: {
      return {
        ...state,
        searchInputValue: action.searchInputValue
      };
    }

    case SELECT_INSTITUTION: {
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
    default:
      return state;
  }
}
