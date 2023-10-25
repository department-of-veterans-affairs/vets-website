import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { prescriptionsReducer } from '../../reducers/prescriptions';
import prescriptions from '../fixtures/prescriptions.json';

describe('Prescriptions reducer', () => {
  const initialState = {
    prescriptionsList: prescriptions,
    prescriptionDetails: undefined,
    prescriptionsPagination: undefined,
  };
  it('should update the prescription details', () => {
    const action = {
      type: Actions.Prescriptions.GET,
      response: { data: { attributes: 'fake test data' } },
    };
    const nextState = prescriptionsReducer(initialState, action);
    expect(nextState.prescriptionDetails).to.exist;
  });

  it('should update the prescription list', () => {
    const action = {
      type: Actions.Prescriptions.GET_PAGINATED_SORTED_LIST,
      response: {
        data: [{ attributes: 'fake test data' }],
        meta: { pagination: 'fake meta data' },
      },
    };
    const nextState = prescriptionsReducer(initialState, action);
    expect(nextState.prescriptionsList).to.exist;
    expect(nextState.prescriptionsPagination).to.exist;
  });

  it('should set the success flag to true', () => {
    const action = {
      type: Actions.Prescriptions.FILL,
      response: {
        id: prescriptions[0].prescriptionId,
      },
    };
    const nextState = prescriptionsReducer(initialState, action);
    expect(nextState.prescriptionDetails.success).to.equal(true);
  });

  it('should handle a fill error', () => {
    const action = {
      type: Actions.Prescriptions.FILL_ERROR,
      err: {
        id: prescriptions[0].prescriptionId,
      },
    };
    const nextState = prescriptionsReducer(initialState, action);
    expect(nextState.prescriptionDetails.error).to.exist;
  });

  it('should clear the error', () => {
    const action = {
      type: Actions.Prescriptions.CLEAR_ERROR,
      prescriptionId: prescriptions[0].prescriptionId,
    };
    const nextState = prescriptionsReducer(initialState, action);
    expect(nextState.prescriptionDetails.error).to.equal(undefined);
  });
});
