import { expect } from 'chai';
import * as schoolSearch from '../../selectors/schoolSearch';

const ownProps = {
  formContext: {
    submitted: false,
  },
  errorSchema: {
    facilityCode: {
      __errors: [],
    },
  },
};

const state = {
  schoolSelect: {
    currentPageNumber: 1,
    institutions: [],
    institutionQuery: '',
    institutionSelected: {},
    manualSchoolEntryChecked: false,
    pagesCount: 0,
    searchInputValue: '',
    searchResultsCount: 0,
    showInstitutions: false,
    showInstitutionsLoading: false,
    showNoResultsFound: false,
    showPagination: false,
    showPaginationLoading: false,
    showSearchResults: true,
  },
};

describe('SchoolSearch', () => {
  it('should pass selectCurrentPageNumber', () => {
    const currentPageNumber = schoolSearch.selectCurrentPageNumber(state);
    expect(currentPageNumber).to.eql(1);
  });
  it('should pass selectInstitutionQuery', () => {
    const institutionQuery = schoolSearch.selectInstitutionQuery(state);
    expect(institutionQuery).to.eql('');
  });
  it('should pass selectInstitutions', () => {
    const institutions = schoolSearch.selectInstitutions(state);
    expect(institutions).to.eql([]);
  });
  it('should pass selectInstitutionSelected', () => {
    const institutionSelected = schoolSearch.selectInstitutionSelected(state);
    expect(institutionSelected).to.eql({});
  });
  it('should pass selectInstitutionSelected', () => {
    const institutionSelected = schoolSearch.selectInstitutionSelected(state);
    expect(institutionSelected).to.eql({});
  });
  it('should pass selectManualSchoolEntryChecked', () => {
    const manualSchoolEntryChecked = schoolSearch.selectManualSchoolEntryChecked(
      state,
    );
    expect(manualSchoolEntryChecked).to.be.false;
  });
  it('should pass selectPagesCount', () => {
    const pagesCount = schoolSearch.selectPagesCount(state);
    expect(pagesCount).to.eql(0);
  });
  it('should pass selectSearchInputValue', () => {
    const searchInputValue = schoolSearch.selectSearchInputValue(state);
    expect(searchInputValue).to.eql('');
  });
  it('should pass selectSearchResultsCount', () => {
    const searchResultsCount = schoolSearch.selectSearchResultsCount(state);
    expect(searchResultsCount).to.eql(0);
  });
  it('should pass selectShowInstitutions', () => {
    const showInstitutions = schoolSearch.selectShowInstitutions(state);
    expect(showInstitutions).to.be.false;
  });
  it('should pass selectShowInstitutionsLoading', () => {
    const showInstitutionsLoading = schoolSearch.selectShowInstitutionsLoading(
      state,
    );
    expect(showInstitutionsLoading).to.be.false;
  });
  it('should pass selectShowNoResultsFound', () => {
    const showNoResultsFound = schoolSearch.selectShowNoResultsFound(state);
    expect(showNoResultsFound).to.be.false;
  });
  it('should pass selectShowPagination', () => {
    const showPagination = schoolSearch.selectShowPagination(state);
    expect(showPagination).to.be.false;
  });
  it('should pass selectShowPaginationLoading', () => {
    const showPaginationLoading = schoolSearch.selectShowPaginationLoading(
      state,
    );
    expect(showPaginationLoading).to.eql(false);
  });
  it('should pass selectShowSearchResults', () => {
    const showSearchResults = schoolSearch.selectShowSearchResults(state);
    expect(showSearchResults).to.be.true;
  });
  it('should pass selectFormSubmitted', () => {
    const submitted = schoolSearch.selectFormSubmitted(ownProps);
    expect(submitted).to.be.false;
  });
  it('should pass selectFacilityCodeErrorMessages', () => {
    const errorMessages = schoolSearch.selectFacilityCodeErrorMessages(
      ownProps,
    );
    expect(errorMessages).to.deep.equal([]);
  });
});
