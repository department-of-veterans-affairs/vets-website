import { expect } from 'chai';

import schoolSelect from '../../reducers/schoolSelect';

describe('schoolSearch reducer', () => {
  describe('LOAD_SCHOOLS_STARTED', () => {
    it('should return a loading institution state', () => {
      const previousState = {
        currentPageNumber: 2,
        institutionQuery: 'old',
        institutions: ['old'],
        institutionSelected: { selected: 'old' },
        searchResultsCount: 20,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false
      };

      const expectedState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [],
        institutionSelected: {},
        searchResultsCount: 0,
        showInstitutions: false,
        showInstitutionsLoading: true,
        showPagination: false,
        showPaginationLoading: false
      };

      const action = {
        type: 'LOAD_SCHOOLS_STARTED',
        institutionQuery: 'new'
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
    it('should return a loading page state', () => {
      const previousState = {
        currentPageNumber: 2,
        institutionQuery: 'old',
        institutions: ['old'],
        institutionSelected: { selected: 'old' },
        searchResultsCount: 30,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false
      };

      const expectedState = {
        currentPageNumber: 3,
        institutionQuery: 'old',
        institutions: [],
        institutionSelected: {},
        searchResultsCount: 30,
        showInstitutions: false,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: true
      };

      const action = {
        type: 'LOAD_SCHOOLS_STARTED',
        institutionQuery: 'old',
        page: 3
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
        showPaginationLoading: false
      };

      const expectedState = {
        currentPageNumber: 1,
        institutionQuery: 'new',
        institutions: [{
          city: 'testCity',
          country: 'testCountry',
          facilityCode: 'testFacilityCode',
          name: 'testName',
          state: 'testState',
          zip: 'testZip'
        }],
        institutionSelected: {},
        pagesCount: 201,
        searchResultsCount: 2001,
        showInstitutions: true,
        showInstitutionsLoading: false,
        showPagination: true,
        showPaginationLoading: false
      };

      const action = {
        type: 'LOAD_SCHOOLS_SUCCEEDED',
        institutionQuery: 'new',
        page: 3,
        payload: {
          data: [{
            attributes: {
              city: 'testCity',
              country: 'testCountry',
              facilityCode: 'testFacilityCode',
              name: 'testName',
              state: 'testState',
              zip: 'testZip'
            }
          }],
          meta: {
            count: 2001
          }
        }
      };

      const actualState = schoolSelect(previousState, action);

      expect(actualState).to.eql(expectedState);
    });
  });
});
