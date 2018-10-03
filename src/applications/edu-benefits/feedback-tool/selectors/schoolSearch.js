import _ from 'lodash';

export const selectCurrentPageNumber = state =>
  _.get(state, 'schoolSelect.currentPageNumber');
export const selectFacilityCodeErrorMessages = ownProps =>
  _.get(ownProps, 'errorSchema.view:facilityCode.__errors');
export const selectFormSubmitted = ownProps =>
  _.get(ownProps, 'formContext.submitted');
export const selectInstitutionQuery = state =>
  _.get(state, 'schoolSelect.institutionQuery');
export const selectInstitutions = state =>
  _.get(state, 'schoolSelect.institutions');
export const selectInstitutionSelected = state =>
  _.get(state, 'schoolSelect.institutionSelected');
export const selectManualSchoolEntryChecked = state =>
  _.get(
    state,
    'form.data.educationDetails.school.view:searchSchoolSelect.view:manualSchoolEntryChecked',
  );
export const selectPagesCount = state =>
  _.get(state, 'schoolSelect.pagesCount');
export const selectSearchInputValue = state =>
  _.get(state, 'schoolSelect.searchInputValue');
export const selectSearchResultsCount = state =>
  _.get(state, 'schoolSelect.searchResultsCount');
export const selectShowInstitutions = state =>
  _.get(state, 'schoolSelect.showInstitutions');
export const selectShowInstitutionsLoading = state =>
  _.get(state, 'schoolSelect.showInstitutionsLoading');
export const selectShowNoResultsFound = state =>
  _.get(state, 'schoolSelect.showNoResultsFound');
export const selectShowPagination = state =>
  _.get(state, 'schoolSelect.showPagination');
export const selectShowPaginationLoading = state =>
  _.get(state, 'schoolSelect.showPaginationLoading');
export const selectShowSearchResults = state =>
  !selectManualSchoolEntryChecked(state);
