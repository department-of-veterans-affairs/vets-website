import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, resetFetch } from '../../../../../platform/testing/unit/helpers.js';
import {
  clearSearch,
  searchInputChange,
  searchSchools,
  selectInstitution,
  toggleManualSchoolEntry
} from '../../../complaint-tool/actions/schoolSearch';

function setFetchResponse(stub, data) {
  const response = new Response(null, { headers: { 'content-type': ['application/json'] } });
  response.ok = true;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

function setFetchFailure(stub, data) {
  const response = new Response(null, { headers: { 'content-type': ['application/json'] } });
  response.ok = false;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('schoolSearch actions', () => {
  describe('clearSearch', () => {
    it('should return a SEARCH_CLEARED action', () => {
      expect(clearSearch()).to.eql({
        type: 'SEARCH_CLEARED'
      });
    });
  });
  describe('searchInputChange', () => {
    it('should return a SEARCH_INPUT_CHANGED action', () => {
      expect(searchInputChange({ searchInputValue: 'test' })).to.eql({
        type: 'SEARCH_INPUT_CHANGED',
        searchInputValue: 'test'
      });
    });
  });
  describe('searchSchools', () => {
    it('should dispatch LOAD_SCHOOLS_STARTED and LOAD_SCHOOLS_SUCCEEDED actions', (done) => {
      const payload = { test: 'test' };
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), payload);

      const dispatch = sinon.spy();

      const schoolSearchQuery = {
        institutionQuery: 'testQuery',
        page: 1
      };

      searchSchools(schoolSearchQuery)(dispatch);

      expect(dispatch.firstCall.calledWith({
        type: 'LOAD_SCHOOLS_STARTED',
        institutionQuery: 'testQuery',
        page: 1
      })).to.be.true;

      setTimeout(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: 'LOAD_SCHOOLS_SUCCEEDED',
          payload,
          institutionQuery: 'testQuery'
        });
        resetFetch();
        done();
      }, 0);
    });

    it('should dispatch LOAD_SCHOOLS_STARTED and LOAD_SCHOOLS_FAILED actions', (done) => {
      const error = { test: 'test' };
      mockFetch();
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      const schoolSearchQuery = {
        institutionQuery: 'testQuery',
        page: 1
      };

      searchSchools(schoolSearchQuery)(dispatch);

      expect(dispatch.firstCall.calledWith({
        type: 'LOAD_SCHOOLS_STARTED',
        institutionQuery: 'testQuery',
        page: 1
      })).to.be.true;

      setTimeout(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: 'LOAD_SCHOOLS_FAILED',
          error,
          institutionQuery: 'testQuery'
        });
        resetFetch();
        done();
      }, 0);
    });
  });
  describe('selectInstitution', () => {
    it('should return an INSTITUTION_SELECTED action', () => {
      const action = selectInstitution({
        city: 'testCity',
        facilityCode: 'testFacilityCode',
        name: 'testName',
        state: 'testState'
      });

      expect(action).to.eql({
        type: 'INSTITUTION_SELECTED',
        city: 'testCity',
        facilityCode: 'testFacilityCode',
        name: 'testName',
        state: 'testState'
      });
    });
  });
  describe('toggleManualSchoolEntry', () => {
    it('should return an MANUAL_SCHOOL_ENTRY_TOGGLED action', () => {
      const action = toggleManualSchoolEntry(true);

      expect(action).to.eql({
        type: 'MANUAL_SCHOOL_ENTRY_TOGGLED',
        manualSchoolEntryChecked: true
      });
    });
  });
});
