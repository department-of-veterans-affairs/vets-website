import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { Actions } from '../../util/actionTypes';
import {
  getPrescriptionById,
  clearPrescription,
} from '../../actions/prescription';

describe('prescription actions', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let loggerSpy;

  beforeEach(() => {
    // Mock the global DD_LOGS logger
    loggerSpy = sinon.spy();
    global.window = {
      DD_LOGS: {
        logger: {
          log: loggerSpy,
        },
      },
    };
  });

  afterEach(() => {
    delete global.window;
  });

  describe('getPrescriptionById', () => {
    it('should dispatch success action on successful API call', async () => {
      const prescriptionId = '123';
      const mockResponse = {
        data: {
          attributes: {
            id: prescriptionId,
            name: 'Test Prescription',
            prescriptionName: 'Test Prescription',
            prescriptionNumber: 'RX123456',
          },
        },
      };
      mockApiRequest(mockResponse);

      const store = mockStore();
      await store.dispatch(getPrescriptionById(prescriptionId));

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
        payload: prescriptionId,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[3]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID,
        payload: mockResponse.data.attributes,
      });
    });

    it('should dispatch success action using v2 API when Cerner pilot is enabled', async () => {
      const prescriptionId = '456';
      const mockResponse = {
        data: {
          attributes: {
            id: prescriptionId,
            name: 'OH Prescription',
            prescriptionName: 'OH Prescription',
            prescriptionNumber: 'RX789',
          },
        },
      };
      mockApiRequest(mockResponse);

      const store = mockStore({
        featureToggles: {
          loading: false,
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
        },
      });
      await store.dispatch(getPrescriptionById(prescriptionId));

      // Verify the v2 endpoint was called
      const fetchUrl = global.fetch.firstCall.args[0];
      expect(fetchUrl).to.include('/my_health/v2/prescriptions/456');

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
        payload: prescriptionId,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[3]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID,
        payload: mockResponse.data.attributes,
      });
    });

    it('should fall back to v1 API when feature toggles are still loading', async () => {
      const prescriptionId = '789';
      const mockResponse = {
        data: {
          attributes: {
            id: prescriptionId,
            name: 'Test Prescription',
            prescriptionName: 'Test Prescription',
            prescriptionNumber: 'RX111',
          },
        },
      };
      mockApiRequest(mockResponse);

      const store = mockStore({
        featureToggles: {
          loading: true,
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
        },
      });
      await store.dispatch(getPrescriptionById(prescriptionId));

      // Verify the v1 endpoint was called despite toggle being true
      const fetchUrl = global.fetch.firstCall.args[0];
      expect(fetchUrl).to.include('/my_health/v1/prescriptions/789');
    });

    it('should dispatch error action when prescriptionId is not provided', async () => {
      const store = mockStore();
      await store.dispatch(getPrescriptionById());

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
        payload: undefined,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[3]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Prescription ID is required',
      });

      // Verify Datadog error logging
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.firstCall.args[0]).to.include(
        'Error fetching medication data for Secure Messaging Rx renewal request',
      );
      expect(loggerSpy.firstCall.args[1]).to.deep.include({
        source: 'prescription_action',
        context: 'Secure Messaging - Medication Renewal Request',
      });
      expect(loggerSpy.firstCall.args[2]).to.equal('error');
    });

    it('should dispatch error action when prescriptionId is "undefined"', async () => {
      const store = mockStore();
      await store.dispatch(getPrescriptionById('undefined'));

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
        payload: 'undefined',
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[3]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Prescription ID is required',
      });

      // Verify Datadog error logging
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.firstCall.args[1].prescriptionId).to.equal('undefined');
    });

    it('should dispatch error action on API error', async () => {
      const prescriptionId = '123';
      const errorResponse = {
        errors: [{ status: '500', title: 'Internal Server Error' }],
      };
      mockApiRequest(errorResponse);

      const store = mockStore();
      await store.dispatch(getPrescriptionById(prescriptionId));

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
        payload: prescriptionId,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[3]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Internal Server Error',
      });

      // Verify Datadog error logging
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.firstCall.args[0]).to.include('Internal Server Error');
      expect(loggerSpy.firstCall.args[1].errorStatus).to.equal('500');
    });

    it('should dispatch error action on 404 error', async () => {
      const prescriptionId = '123';
      const errorResponse = {
        errors: [{ status: '404', title: 'Record not found' }],
      };
      mockApiRequest(errorResponse);

      const store = mockStore();
      await store.dispatch(getPrescriptionById(prescriptionId));

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
        payload: prescriptionId,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[3]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Record not found',
      });

      // Verify Datadog error logging with 404 status
      expect(loggerSpy.called).to.be.true;
      expect(loggerSpy.firstCall.args[0]).to.include('Record not found');
      expect(loggerSpy.firstCall.args[1].errorStatus).to.equal('404');
      expect(loggerSpy.firstCall.args[1].prescriptionId).to.equal('123');
    });
  });

  describe('clearPrescription', () => {
    it('should return the correct action', () => {
      const action = clearPrescription();
      expect(action).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
    });
  });
});
