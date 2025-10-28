import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import {
  getPrescriptionById,
  clearPrescription,
} from '../../actions/prescription';

describe('prescription actions', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

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
