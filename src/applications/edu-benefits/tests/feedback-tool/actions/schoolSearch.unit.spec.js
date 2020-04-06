import sinon from 'sinon';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers.js';
import {
  clearSearch,
  restoreFromPrefill,
  searchInputChange,
  searchSchools,
  selectInstitution,
  toggleManualSchoolEntry,
} from '../../../feedback-tool/actions/schoolSearch';

describe('schoolSearch actions', () => {
  describe('clearSearch', () => {
    test('should return a SEARCH_CLEARED action', () => {
      expect(clearSearch()).toEqual({
        type: 'SEARCH_CLEARED',
      });
    });
  });

  describe('restoreFromPrefill', () => {
    test(
      'should dispatch RESTORE_FROM_PREFILL_STARTED and RESTORE_FROM_PREFILL_SUCCEEDED actions',
      done => {
        const payload = { test: 'test' };
        mockFetch();
        setFetchResponse(global.fetch.onFirstCall(), payload);

        const dispatch = sinon.spy();

        const restoreInformation = {
          institutionSelected: {
            test: 'test',
          },
          institutionQuery: 'testQuery',
          page: 1,
          searchInputValue: 'test',
        };

        restoreFromPrefill(restoreInformation)(dispatch);

        expect(
          dispatch.firstCall.calledWith({
            type: 'RESTORE_FROM_PREFILL_STARTED',
            institutionSelected: {
              test: 'test',
            },
            institutionQuery: 'testQuery',
            page: 1,
            searchInputValue: 'test',
          }),
        ).toBe(true);

        setTimeout(() => {
          expect(dispatch.secondCall.args[0]).toEqual({
            type: 'RESTORE_FROM_PREFILL_SUCCEEDED',
            payload,
            institutionQuery: 'testQuery',
          });
          resetFetch();
          done();
        }, 0);
      }
    );

    test(
      'should dispatch LOAD_SCHOOLS_STARTED and LOAD_SCHOOLS_FAILED actions',
      done => {
        const error = { test: 'test' };
        mockFetch();
        setFetchFailure(global.fetch.onFirstCall(), error);

        const dispatch = sinon.spy();

        const restoreInformation = {
          institutionSelected: {
            test: 'test',
          },
          institutionQuery: 'testQuery',
          page: 1,
          searchInputValue: 'test',
        };

        restoreFromPrefill(restoreInformation)(dispatch);

        expect(
          dispatch.firstCall.calledWith({
            type: 'RESTORE_FROM_PREFILL_STARTED',
            institutionSelected: {
              test: 'test',
            },
            institutionQuery: 'testQuery',
            page: 1,
            searchInputValue: 'test',
          }),
        ).toBe(true);

        setTimeout(() => {
          expect(dispatch.secondCall.args[0]).toEqual({
            type: 'RESTORE_FROM_PREFILL_FAILED',
            error,
            institutionQuery: 'testQuery',
          });
          resetFetch();
          done();
        }, 0);
      }
    );
  });

  describe('searchInputChange', () => {
    test('should return a SEARCH_INPUT_CHANGED action', () => {
      expect(searchInputChange({ searchInputValue: 'test' })).toEqual({
        type: 'SEARCH_INPUT_CHANGED',
        searchInputValue: 'test',
      });
    });
  });
  describe('searchSchools', () => {
    test(
      'should dispatch LOAD_SCHOOLS_STARTED and LOAD_SCHOOLS_SUCCEEDED actions',
      done => {
        const payload = { test: 'test' };
        mockFetch();
        setFetchResponse(global.fetch.onFirstCall(), payload);

        const dispatch = sinon.spy();

        const schoolSearchQuery = {
          institutionQuery: 'testQuery',
          page: 1,
        };

        searchSchools(schoolSearchQuery)(dispatch);

        expect(
          dispatch.firstCall.calledWith({
            type: 'LOAD_SCHOOLS_STARTED',
            institutionQuery: 'testQuery',
            page: 1,
          }),
        ).toBe(true);

        setTimeout(() => {
          expect(dispatch.secondCall.args[0]).toEqual({
            type: 'LOAD_SCHOOLS_SUCCEEDED',
            payload,
            institutionQuery: 'testQuery',
          });
          resetFetch();
          done();
        }, 0);
      }
    );

    test(
      'should dispatch LOAD_SCHOOLS_STARTED and LOAD_SCHOOLS_FAILED actions',
      done => {
        const error = { test: 'test' };
        mockFetch();
        setFetchFailure(global.fetch.onFirstCall(), error);

        const dispatch = sinon.spy();

        const schoolSearchQuery = {
          institutionQuery: 'testQuery',
          page: 1,
        };

        searchSchools(schoolSearchQuery)(dispatch);

        expect(
          dispatch.firstCall.calledWith({
            type: 'LOAD_SCHOOLS_STARTED',
            institutionQuery: 'testQuery',
            page: 1,
          }),
        ).toBe(true);

        setTimeout(() => {
          expect(dispatch.secondCall.args[0]).toEqual({
            type: 'LOAD_SCHOOLS_FAILED',
            error,
            institutionQuery: 'testQuery',
          });
          resetFetch();
          done();
        }, 0);
      }
    );
  });
  describe('selectInstitution', () => {
    test('should return an INSTITUTION_SELECTED action', () => {
      const action = selectInstitution({
        address1: 'testAddress1',
        address2: 'testAddress2',
        address3: 'testAddress3',
        city: 'testCity',
        facilityCode: 'testFacilityCode',
        name: 'testName',
        state: 'testState',
      });

      expect(action).toEqual({
        type: 'INSTITUTION_SELECTED',
        address1: 'testAddress1',
        address2: 'testAddress2',
        address3: 'testAddress3',
        city: 'testCity',
        facilityCode: 'testFacilityCode',
        name: 'testName',
        state: 'testState',
      });
    });
  });
  describe('toggleManualSchoolEntry', () => {
    test('should return an MANUAL_SCHOOL_ENTRY_TOGGLED action', () => {
      const action = toggleManualSchoolEntry(true);

      expect(action).toEqual({
        type: 'MANUAL_SCHOOL_ENTRY_TOGGLED',
        manualSchoolEntryChecked: true,
      });
    });
  });
});
