import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import * as cernerSelectors from '~/platform/user/cerner-dsot/selectors';
import {
  clearAllergyDetails,
  getAllergiesList,
  getAllergyDetails,
} from '../../actions/allergies';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';
import allergy from '../fixtures/allergy.json';

describe('Get allergies action with decoupled logic', () => {
  let selectIsCernerPatientStub;

  beforeEach(() => {
    selectIsCernerPatientStub = sinon.stub(
      cernerSelectors,
      'selectIsCernerPatient',
    );
  });

  afterEach(() => {
    selectIsCernerPatientStub.restore();
  });

  describe('getAllergiesList', () => {
    it('should use v2 endpoint when acceleration flags are enabled', async () => {
      selectIsCernerPatientStub.returns(false);
      const mockData = allergies;

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: true,
          mhvAcceleratedDeliveryAllergiesEnabled: true,
        },
      });

      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false);

      await thunk(dispatch, getState);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const unifiedListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_UNIFIED_LIST,
      );

      expect(unifiedListCall).to.exist;
      expect(unifiedListCall.args[0].response).to.equal(mockData);
    });

    it('should use v1 OH endpoint when user is Cerner but acceleration disabled', async () => {
      selectIsCernerPatientStub.returns(true);
      const mockData = allergies;

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: false,
          mhvAcceleratedDeliveryAllergiesEnabled: false,
        },
      });

      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false);

      await thunk(dispatch, getState);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const getListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_LIST,
      );

      expect(getListCall).to.exist;
      expect(getListCall.args[0].response).to.equal(mockData);
    });

    it('should use regular v1 endpoint for VistA users', async () => {
      selectIsCernerPatientStub.returns(false);
      const mockData = allergies;

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: false,
          mhvAcceleratedDeliveryAllergiesEnabled: false,
        },
      });

      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false);

      await thunk(dispatch, getState);

      // Check that the correct action type was dispatched
      const dispatchCalls = dispatch.getCalls();
      const getListCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_LIST,
      );

      expect(getListCall).to.exist;
      expect(getListCall.args[0].response).to.equal(mockData);
    });

    it('should prioritize acceleration over Cerner when both are true', async () => {
      selectIsCernerPatientStub.returns(true);
      const mockData = allergies;

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: true,
          mhvAcceleratedDeliveryAllergiesEnabled: true,
        },
      });

      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergiesList(false);

      await thunk(dispatch, getState);

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

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: true,
          mhvAcceleratedDeliveryAllergiesEnabled: true,
        },
      });

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList);

      await thunk(dispatch, getState);

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

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: true,
          mhvAcceleratedDeliveryAllergiesEnabled: true,
        },
      });

      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList);

      await thunk(dispatch, getState);

      // Should use v2 endpoint
      const dispatchCalls = dispatch.getCalls();
      const unifiedItemCall = dispatchCalls.find(
        call => call.args[0].type === Actions.Allergies.GET_UNIFIED_ITEM,
      );

      expect(unifiedItemCall).to.exist;
    });

    it('should use v1 endpoint when acceleration disabled and item not in list', async () => {
      const mockData = allergy;
      const allergyList = []; // Empty list, so will fetch from API

      const getState = sinon.stub().returns({
        featureToggles: {
          mhvAcceleratedDeliveryEnabled: false,
          mhvAcceleratedDeliveryAllergiesEnabled: false,
        },
      });

      mockApiRequest(mockData);

      const dispatch = sinon.spy();
      const thunk = getAllergyDetails('123', allergyList);

      await thunk(dispatch, getState);

      // Should use v1 endpoint
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
