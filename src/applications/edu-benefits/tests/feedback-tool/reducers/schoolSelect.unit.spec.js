import { expect } from 'chai';

import schoolSelect from '../../../feedback-tool/reducers/schoolSelect';

describe('schoolSearch reducer', () => {
  describe('INSTITUTION_SELECTED', () => {
    it('should return an institution selected state', () => {
      const previousState = {
        oldState: [],
        institutionSelected: { selected: 'old' },
      };

      const expectedState = {
        ...previousState,
        institutionSelected: {
          address1: 'testaddress1',
          address2: 'testaddress2',
          address3: 'testaddress3',
          city: 'testCity',
          facilityCode: 'testFacilityCode',
          name: 'testName',
          state: 'testState',
        },
      };

      const action = {
        type: 'INSTITUTION_SELECTED',
        address1: 'testaddress1',
        address2: 'testaddress2',
        address3: 'testaddress3',
        city: 'testCity',
        facilityCode: 'testFacilityCode',
        name: 'testName',
        state: 'testState',
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
  describe('LOAD_SCHOOLS_FAILED', () => {
    it('should return a loading institutions failed state', () => {
      const previousState = {
        currentPageNumber: 2,
        institutionQuery: 'old',
        institutions: ['old'],
        institutionSelected: { selected: 'old' },
        searchResultsCount: 20,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false,
      };

      const expectedState = {
        currentPageNumber: 0,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        pagesCount: 0,
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showNoResultsFound: true,
        showPagination: false,
        showPaginationLoading: false,
      };

      const action = {
        type: 'LOAD_SCHOOLS_FAILED',
        institutionQuery: 'new',
        error: 'test',
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });

  describe('LOAD_SCHOOLS_STARTED', () => {
    it('should return a loading institution state', () => {
      const previousState = {
        currentPageNumber: 2,
        institutionQuery: 'old',
        institutions: ['old'],
        institutionSelected: { selected: 'old' },
        manualSchoolEntryChecked: false,
        searchResultsCount: 20,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false,
        showSearchResults: true,
      };

      const expectedState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        manualSchoolEntryChecked: false,
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: true,
        showNoResultsFound: false,
        showPagination: false,
        showPaginationLoading: false,
        showSearchResults: true,
      };

      const action = {
        type: 'LOAD_SCHOOLS_STARTED',
        institutionQuery: 'new',
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
    it('should return a loading page state', () => {
      const previousState = {
        currentPageNumber: 2,
        institutionQuery: 'old',
        institutions: ['old'],
        manualSchoolEntryChecked: false,
        institutionSelected: { selected: 'old' },
        searchResultsCount: 30,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false,
        showSearchResults: true,
      };

      const expectedState = {
        currentPageNumber: 3,
        institutionQuery: 'old',
        institutions: [],
        manualSchoolEntryChecked: false,
        institutionSelected: {},
        searchResultsCount: 30,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showNoResultsFound: false,
        showPagination: true,
        showPaginationLoading: true,
        showSearchResults: true,
      };

      const action = {
        type: 'LOAD_SCHOOLS_STARTED',
        institutionQuery: 'old',
        page: 3,
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
  describe('LOAD_SCHOOLS_SUCCEEDED', () => {
    it('should return a load schools succeeded state', () => {
      const previousState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: true,
        showPagination: false,
        showPaginationLoading: false,
      };

      const expectedState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [
          {
            address1: 'testAddress1',
            address2: 'testAddress2',
            address3: 'testAddress3',
            city: 'testCity',
            country: 'testCountry',
            facilityCode: 'testFacilityCode',
            name: 'testName',
            state: 'testState',
            zip: 'testZip',
          },
        ],
        institutionSelected: {},
        pagesCount: 201,
        searchResultsCount: 2001,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showNoResultsFound: false,
        showPagination: true,
        showPaginationLoading: false,
      };

      const action = {
        type: 'LOAD_SCHOOLS_SUCCEEDED',
        institutionQuery: 'new',
        page: 3,
        payload: {
          data: [
            {
              attributes: {
                address1: 'testAddress1',
                address2: 'testAddress2',
                address3: 'testAddress3',
                city: 'testCity',
                country: 'testCountry',
                facilityCode: 'testFacilityCode',
                name: 'testName',
                state: 'testState',
                zip: 'testZip',
              },
            },
          ],
          meta: {
            count: 2001,
          },
        },
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });

    it('should set null values to empty strings', () => {
      const previousState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: true,
        showPagination: false,
        showPaginationLoading: false,
      };

      const expectedState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [
          {
            address1: '',
            address2: '',
            address3: '',
            city: '',
            country: '',
            facilityCode: 'testFacilityCode',
            name: '',
            state: '',
            zip: '',
          },
        ],
        institutionSelected: {},
        pagesCount: 201,
        searchResultsCount: 2001,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showNoResultsFound: false,
        showPagination: true,
        showPaginationLoading: false,
      };

      const action = {
        type: 'LOAD_SCHOOLS_SUCCEEDED',
        institutionQuery: 'new',
        page: 3,
        payload: {
          data: [
            {
              attributes: {
                address1: null,
                city: null,
                country: null,
                facilityCode: 'testFacilityCode',
                name: null,
                state: null,
                zip: null,
              },
            },
          ],
          meta: {
            count: 2001,
          },
        },
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });

    it('should return a no results state', () => {
      const previousState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: true,
        showPagination: false,
        showPaginationLoading: false,
      };

      const expectedState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        pagesCount: 0,
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showNoResultsFound: true,
        showPagination: false,
        showPaginationLoading: false,
      };

      const action = {
        type: 'LOAD_SCHOOLS_SUCCEEDED',
        institutionQuery: 'new',
        page: 3,
        payload: {
          data: [],
          meta: {
            count: 0,
          },
        },
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
  describe('RESTORE_FROM_PREFILL_STARTED', () => {
    it('should return a loading institution state', () => {
      const previousState = {
        currentPageNumber: 2,
        institutionQuery: 'old',
        institutions: ['old'],
        institutionSelected: { selected: 'old' },
        manualSchoolEntryChecked: false,
        searchResultsCount: 20,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false,
        showSearchResults: true,
      };

      const expectedState = {
        currentPageNumber: 5,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {
          test: 'test',
        },
        manualSchoolEntryChecked: false,
        searchInputValue: 'new',
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: true,
        showNoResultsFound: false,
        showPagination: false,
        showPaginationLoading: false,
        showSearchResults: true,
      };

      const action = {
        type: 'RESTORE_FROM_PREFILL_STARTED',
        institutionQuery: 'new',
        institutionSelected: {
          test: 'test',
        },
        page: 5,
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
  describe('SEARCH_CLEARED', () => {
    it('should return a search cleared state', () => {
      const previousState = {
        oldState: [],
      };

      const expectedState = {
        currentPageNumber: 1,
        institutions: [],
        manualSchoolEntryChecked: false,
        institutionQuery: '',
        institutionSelected: {},
        pagesCount: 0,
        searchInputValue: '',
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showNoResultsFound: false,
        showPagination: false,
        showPaginationLoading: false,
        showSearchResults: true,
      };

      const action = {
        type: 'SEARCH_CLEARED',
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
  describe('SEARCH_INPUT_CHANGED', () => {
    it('should return a search input changed state', () => {
      const previousState = {
        oldState: [],
      };

      const expectedState = {
        ...previousState,
        searchInputValue: 'test',
      };

      const action = {
        type: 'SEARCH_INPUT_CHANGED',
        searchInputValue: 'test',
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
});
