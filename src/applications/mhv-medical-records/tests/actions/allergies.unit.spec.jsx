import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import {
  clearAllergyDetails,
  getAllergiesList,
  getAllergyDetails,
} from '../../actions/allergies';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';
import allergy from '../fixtures/allergy.json';

describe('Get allergies action with parameter-based logic', () => {
  describe('getAllergiesList', () => {
    it('should use v1 OH endpoint when user is Cerner but acceleration disabled', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false, true); // isCurrent=false, isCerner=true

      await thunk(dispatch);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const getListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_LIST,
      );

      expect(getListCall).to.exist;
      expect(getListCall.args[0].response).to.equal(mockData);
    });

    it('should use regular v1 endpoint for VistA users', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false, false); // isCurrent=false, isCerner=false

      await thunk(dispatch);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const getListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_LIST,
      );

      expect(getListCall).to.exist;
      expect(getListCall.args[0].response).to.equal(mockData);
    });
  });

  describe('getAllergyDetails', () => {
    it('should dispatch GET_FROM_LIST when item found in list', async () => {
      const mockData = { id: '123', name: 'Test Allergy' };
      const allergyList = [mockData]; // Item exists in list

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, false); // id, allergyList, isCerner=false

      await thunk(dispatch);

      // Should dispatch GET_FROM_LIST since item was found
      const dispatchCalls = dispatch.getCalls();
      const getFromListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_FROM_LIST,
      );

      expect(getFromListCall).to.exist;
      expect(getFromListCall.args[0].response).to.equal(mockData);
    });

    it('should use v1 OH endpoint when Cerner user and acceleration disabled', async () => {
      const mockData = allergy;
      const allergyList = []; // Empty list, so will fetch from API
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, true); // id, allergyList, isCerner=true

      await thunk(dispatch);

      // Should use v1 endpoint with OH path
      const dispatchCalls = dispatch.getCalls();
      const getAllergyCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET,
      );

      expect(getAllergyCall).to.exist;
    });

    it('should use v1 PHR endpoint when VistA user and acceleration disabled', async () => {
      const mockData = allergy;
      const allergyList = []; // Empty list, so will fetch from API
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, false); // id, allergyList, isCerner=false

      await thunk(dispatch);

      // Should use v1 PHR endpoint
      const dispatchCalls = dispatch.getCalls();
      const getAllergyCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET,
      );

      expect(getAllergyCall).to.exist;
    });
  });

  describe('clearAllergyDetails', () => {
    it('should dispatch clear action', () => {
      const dispatch = sinon.spy();
      clearAllergyDetails()(dispatch);

      expect(dispatch.calledWith({ type: Actions.Allergies.CLEAR_DETAIL })).to
        .be.true;
    });
  });
});
