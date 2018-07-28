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
  });
});
