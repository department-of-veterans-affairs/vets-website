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
import error404 from '../fixtures/404.json';

describe('unable to get vitals action because of server error', () => {
  it('should not use v1 OH endpoint when user is Cerner but acceleration disabled', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    const thunk = getAllergiesList(false, true); // isCurrent=false, isCerner=true
    await thunk(dispatch);
    // Check that the correct action type was dispatched
    const dispatchCalls = dispatch.getCalls();
    const getListCall = dispatchCalls.find(
      call => call.args[0].type === Actions.Allergies.GET_LIST,
    );
    expect(getListCall).to.not.exist;
  });
});

describe('Get allergies action with parameter-based logic', () => {
  describe('getAllergiesList', () => {
    it('should use v2 endpoint when acceleration flags are enabled', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false, true, false); // isCurrent=false, isAccelerating=true, isCerner=false

      await thunk(dispatch);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const unifiedListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_UNIFIED_LIST,
      );

      expect(unifiedListCall).to.exist;
      expect(unifiedListCall.args[0].response).to.equal(mockData);
    });

    it('should use v1 OH endpoint when user is Cerner but acceleration disabled', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false, false, true); // isCurrent=false, isAccelerating=false, isCerner=true

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
      const thunk = getAllergiesList(false, false, false); // isCurrent=false, isAccelerating=false, isCerner=false

      await thunk(dispatch);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const getListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_LIST,
      );

      expect(getListCall).to.exist;
      expect(getListCall.args[0].response).to.equal(mockData);
    });

    it('should prioritize acceleration over Cerner when both are true', async () => {
      const mockData = allergies;
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false, true, true); // isCurrent=false, isAccelerating=true, isCerner=true

      await thunk(dispatch);

      // Check that acceleration takes priority over Cerner
      const dispatchCalls = dispatch.getCalls();
      const unifiedListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_UNIFIED_LIST,
      );

      expect(unifiedListCall).to.exist;
      expect(unifiedListCall.args[0].response).to.equal(mockData);
    });
  });

  describe('getAllergyDetails', () => {
    it('should dispatch GET_FROM_LIST when item found in list', async () => {
      const mockData = { id: '123', name: 'Test Allergy' };
      const allergyList = [mockData]; // Item exists in list

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, true, false); // id, allergyList, isAccelerating=true, isCerner=false

      await thunk(dispatch);

      // Should dispatch GET_FROM_LIST since item was found
      const dispatchCalls = dispatch.getCalls();
      const getFromListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_FROM_LIST,
      );

      expect(getFromListCall).to.exist;
      expect(getFromListCall.args[0].response).to.equal(mockData);
    });

    it('should use v2 endpoint when acceleration enabled and item not in list', async () => {
      const mockData = allergy;
      const allergyList = []; // Empty list, so will fetch from API
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, true, false); // id, allergyList, isAccelerating=true, isCerner=false

      await thunk(dispatch);

      // Should use v2 endpoint
      const dispatchCalls = dispatch.getCalls();
      const unifiedItemCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_UNIFIED_ITEM,
      );

      expect(unifiedItemCall).to.exist;
    });

    it('should use v1 OH endpoint when Cerner user and acceleration disabled', async () => {
      const mockData = allergy;
      const allergyList = []; // Empty list, so will fetch from API
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, false, true); // id, allergyList, isAccelerating=false, isCerner=true

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
      const thunk = getAllergyDetails('123', allergyList, false, false); // id, allergyList, isAccelerating=false, isCerner=false

      await thunk(dispatch);

      // Should use v1 PHR endpoint
      const dispatchCalls = dispatch.getCalls();
      const getAllergyCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET,
      );

      expect(getAllergyCall).to.exist;
    });

    it('should prioritize acceleration over Cerner when both are true', async () => {
      const mockData = allergy;
      const allergyList = []; // Empty list, so will fetch from API
      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList, true, true); // id, allergyList, isAccelerating=true, isCerner=true

      await thunk(dispatch);

      // Should use v2 endpoint (acceleration takes priority)
      const dispatchCalls = dispatch.getCalls();
      const unifiedItemCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_UNIFIED_ITEM,
      );

      expect(unifiedItemCall).to.exist;
    });

    it('should dispatch an add alert action on error and not throw', async () => {
      mockApiRequest(allergy, false);
      const dispatch = sinon.spy();
      await getAllergyDetails('123', [], false, false)(dispatch);
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
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
