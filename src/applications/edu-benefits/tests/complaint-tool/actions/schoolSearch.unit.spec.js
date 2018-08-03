import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, resetFetch } from '../../../../../platform/testing/unit/helpers.js';
import {
  clearSearch,
  setCannotFindSchool,
  searchInputChange,
  searchSchools,
  selectInstitution
} from '../../../complaint-tool/actions/schoolSearch';

function setFetchResponse(stub, data) {
  const response = new Response();
  response.ok = true;
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
        expect(dispatch.secondCall.calledWith({
          type: 'LOAD_SCHOOLS_SUCCEEDED',
          payload,
          institutionQuery: 'testQuery'
        })).to.be.true;
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
  describe('setCannotFindSchool', () => {
    it('should return a SET_DATA action', () => {
      expect(setCannotFindSchool()).to.eql({
        type: 'SET_DATA',
        data: {
          school: {
            'view:cannotFindSchool': true
          }
        }
      });
    });
  });
});
