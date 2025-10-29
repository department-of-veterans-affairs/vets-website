import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import { Actions } from '../../util/actionTypes';
import {
  getPrescriptionById,
  clearPrescription,
} from '../../actions/prescription';

describe('prescription actions', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let datadogSpy;

  beforeEach(() => {
    datadogSpy = sinon.spy(datadogRum, 'addError');
  });

  afterEach(() => {
    datadogSpy.restore();
  });

  describe('getPrescriptionById', () => {
    it('should dispatch success action on successful API call', async () => {
      const prescriptionId = '123';
      const mockResponse = {
        data: {
          attributes: { id: prescriptionId, name: 'Test Prescription' },
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
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID,
        payload: mockResponse.data.attributes,
      });
    });

    it('should dispatch error action when prescriptionId is not provided', async () => {
      const store = mockStore();
      await store.dispatch(getPrescriptionById());

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Prescription ID is required',
      });

      // Verify Datadog error logging
      expect(datadogSpy.called).to.be.true;
      expect(datadogSpy.firstCall.args[0].message).to.include(
        'Error fetching medication data for Secure Messaging Rx renewal request',
      );
      expect(datadogSpy.firstCall.args[1]).to.deep.include({
        source: 'prescription_action',
        context: 'Secure Messaging - Medication Renewal Request',
      });
    });

    it('should dispatch error action when prescriptionId is "undefined"', async () => {
      const store = mockStore();
      await store.dispatch(getPrescriptionById('undefined'));

      const actions = store.getActions();
      expect(actions[0]).to.deep.equal({
        type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
      });
      expect(actions[1]).to.deep.equal({
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Prescription ID is required',
      });

      // Verify Datadog error logging
      expect(datadogSpy.called).to.be.true;
      expect(datadogSpy.firstCall.args[1].prescriptionId).to.equal('undefined');
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
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Internal Server Error',
      });

      // Verify Datadog error logging
      expect(datadogSpy.called).to.be.true;
      expect(datadogSpy.firstCall.args[0].message).to.include(
        'Internal Server Error',
      );
      expect(datadogSpy.firstCall.args[1].errorStatus).to.equal('500');
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
        type: Actions.Prescriptions.IS_LOADING,
      });
      expect(actions[2]).to.deep.equal({
        type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
        payload: 'Record not found',
      });

      // Verify Datadog error logging with 404 status
      expect(datadogSpy.called).to.be.true;
      expect(datadogSpy.firstCall.args[0].message).to.include(
        'Record not found',
      );
      expect(datadogSpy.firstCall.args[1].errorStatus).to.equal('404');
      expect(datadogSpy.firstCall.args[1].prescriptionId).to.equal('123');
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
