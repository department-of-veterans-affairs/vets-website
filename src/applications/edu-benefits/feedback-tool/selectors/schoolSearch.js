import get from 'lodash/get';

export const selectCurrentPageNumber = state =>
  get(state, 'schoolSelect.currentPageNumber');
export const selectFacilityCodeErrorMessages = ownProps =>
  get(ownProps, 'errorSchema.facilityCode.__errors');
export const selectFormSubmitted = ownProps =>
  get(ownProps, 'formContext.submitted');
export const selectInstitutionQuery = state =>
  get(state, 'schoolSelect.institutionQuery');
export const selectInstitutions = state =>
  get(state, 'schoolSelect.institutions');
export const selectInstitutionSelected = state =>
  get(state, 'schoolSelect.institutionSelected');
export const selectManualSchoolEntryChecked = state =>
  get(
    state,
    'form.data.educationDetails.school.view:searchSchoolSelect.view:manualSchoolEntryChecked',
  );
export const selectPagesCount = state => get(state, 'schoolSelect.pagesCount');
export const selectSearchInputValue = state =>
  get(state, 'schoolSelect.searchInputValue');
export const selectSearchResultsCount = state =>
  get(state, 'schoolSelect.searchResultsCount');
export const selectShowInstitutions = state =>
  get(state, 'schoolSelect.showInstitutions');
export const selectShowInstitutionsLoading = state =>
  get(state, 'schoolSelect.showInstitutionsLoading');
export const selectShowNoResultsFound = state =>
  get(state, 'schoolSelect.showNoResultsFound');
export const selectShowPagination = state =>
  get(state, 'schoolSelect.showPagination');
export const selectShowPaginationLoading = state =>
  get(state, 'schoolSelect.showPaginationLoading');
export const selectShowSearchResults = state =>
  !selectManualSchoolEntryChecked(state);
