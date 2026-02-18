import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { prescriptionReducer } from '../../reducers/prescription';

describe('prescription reducer', () => {
  const initialState = {
    renewalPrescription: undefined,
    prescriptionId: undefined,
    redirectPath: undefined,
    error: undefined,
    isLoading: false,
  };

  it('should return the initial state', () => {
    expect(prescriptionReducer(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle IS_LOADING action', () => {
    const action = { type: Actions.Prescriptions.IS_LOADING };
    const expectedState = {
      ...initialState,
      isLoading: true,
    };
    expect(prescriptionReducer(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should handle GET_PRESCRIPTION_BY_ID action', () => {
    const payload = { id: '123', name: 'Test Prescription' };
    const action = {
      type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID,
      payload,
    };
    const expectedState = {
      ...initialState,
      renewalPrescription: payload,
    };
    expect(prescriptionReducer(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should handle GET_PRESCRIPTION_BY_ID_ERROR action', () => {
    const payload = 'Error message';
    const action = {
      type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
      payload,
    };
    const expectedState = {
      ...initialState,
      error: payload,
    };
    expect(prescriptionReducer(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should handle SET_PRESCRIPTION_ID action', () => {
    const payload = '24654491';
    const action = {
      type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
      payload,
    };
    const expectedState = {
      ...initialState,
      prescriptionId: payload,
    };
    expect(prescriptionReducer(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should handle CLEAR_PRESCRIPTION action', () => {
    const stateWithData = {
      renewalPrescription: { id: '123' },
      prescriptionId: '24654491',
      redirectPath: '/some/path',
      error: 'some error',
      isLoading: true,
    };
    const action = { type: Actions.Prescriptions.CLEAR_PRESCRIPTION };
    expect(prescriptionReducer(stateWithData, action)).to.deep.equal(
      initialState,
    );
  });

  it('should handle SET_REDIRECT_PATH action', () => {
    const payload = '/medications/refill';
    const action = {
      type: Actions.Prescriptions.SET_REDIRECT_PATH,
      payload,
    };
    const expectedState = {
      ...initialState,
      redirectPath: payload,
    };
    expect(prescriptionReducer(initialState, action)).to.deep.equal(
      expectedState,
    );
  });

  it('should return current state for unknown action', () => {
    const currentState = {
      ...initialState,
      renewalPrescription: { id: '123' },
    };
    const action = { type: 'UNKNOWN_ACTION' };
    expect(prescriptionReducer(currentState, action)).to.equal(currentState);
  });
});
