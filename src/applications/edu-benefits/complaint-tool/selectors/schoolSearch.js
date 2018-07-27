import _ from 'lodash';

export const selectCurrentPageNumber = state => _.get(state, 'schoolSelect.currentPageNumber');
export const selectInstitutionQuery = state => _.get(state, 'schoolSelect.institutionQuery');
export const selectInstitutions = state => _.get(state, 'schoolSelect.institutions');
export const selectInstitutionSelected = state => _.get(state, 'schoolSelect.institutionSelected');
export const selectPagesCount = state => _.get(state, 'schoolSelect.pagesCount');
export const selectSearchInputValue = state => _.get(state, 'schoolSelect.searchInputValue');
export const selectSearchResultsCount = state => _.get(state, 'schoolSelect.searchResultsCount');
export const selectShowInstitutions = state => _.get(state, 'schoolSelect.showInstitutions');
export const selectShowInstitutionsLoading = state => _.get(state, 'schoolSelect.showInstitutionsLoading');
export const selectShowPagination = state => _.get(state, 'schoolSelect.showPagination');
export const selectShowPaginationLoading = state => _.get(state, 'schoolSelect.showPaginationLoading');
// select institutions
