import { expect } from 'chai';
import {
  initialState,
  prescriptionsReducer,
} from '../../reducers/prescriptions';
import { Actions } from '../../util/actionTypes';
import paginatedSortedListApiResponse from '../fixtures/paginatedSortedListApiResponse.json';
import prescriptionsList from '../fixtures/prescriptionsList.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';

describe('Prescriptions reducer', () => {
  function reduce(action, state = initialState) {
    return prescriptionsReducer(state, action);
  }
  it('should not modify state if an unrecognized action is passed', () => {
    const state = reduce({
      type: 'INVALID_ACTION',
      response: paginatedSortedListApiResponse,
    });

    expect(state).to.deep.equal(initialState);
  });

  it('should change prescriptionsList and prescriptionsPagination when GET_PAGINATED_SORTED_LIST action is passed', () => {
    const rxState = {
      ...initialState,
      prescriptionsList: paginatedSortedListApiResponse.data.map(rx => {
        return { ...rx.attributes };
      }),
      prescriptionsPagination: paginatedSortedListApiResponse.meta.pagination,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_PAGINATED_SORTED_LIST,
      response: paginatedSortedListApiResponse,
    });
    expect(state).to.deep.equal(rxState);
  });
  it('should change prescriptionsFullList when GET_SORTED_LIST action is passed', () => {
    const rxState = {
      ...initialState,
      prescriptionsFullList: prescriptionsList.data.map(rx => {
        return { ...rx.attributes };
      }),
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_SORTED_LIST,
      response: prescriptionsList,
    });
    expect(state).to.deep.equal(rxState);
  });
  it('should change prescriptionDetails when GET_DETIALS action is passed', () => {
    const rxState = {
      ...initialState,
      prescriptionDetails: prescriptionDetails.data.attributes,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_DETAILS,
      response: prescriptionDetails,
    });
    expect(state).to.deep.equal(rxState);
  });
  it('should add error:undefined and sucess:true properties when FILL action is passed', () => {
    const initialStateWithRxList = {
      ...initialState,
      prescriptionsList: paginatedSortedListApiResponse.data.map(rx => {
        return { ...rx.attributes };
      }),
    };
    const state = reduce(
      {
        type: Actions.Prescriptions.FILL,
        response: { id: 22565805 },
      },
      initialStateWithRxList,
    );
    const indexOfRxFilled = state.prescriptionsList.findIndex(
      rx => rx.prescriptionId === 22565805,
    );
    expect(state.prescriptionDetails.error).to.equal(undefined);
    expect(state.prescriptionDetails.success).to.equal(true);
    expect(state.prescriptionsList[indexOfRxFilled].success).to.equal(true);
    expect(state.prescriptionsList[indexOfRxFilled].error).to.equal(undefined);
  });
  it('should add error:error and sucess:undefined properties when FILL_ERROR action is passed', () => {
    const initialStateWithRxList = {
      ...initialState,
      prescriptionsList: paginatedSortedListApiResponse.data.map(rx => {
        return { ...rx.attributes };
      }),
    };
    const state = reduce(
      {
        type: Actions.Prescriptions.FILL_ERROR,
        err: { id: 22565805 },
      },
      initialStateWithRxList,
    );
    const indexOfRxFilled = state.prescriptionsList.findIndex(
      rx => rx.prescriptionId === 22565805,
    );
    expect(state.prescriptionDetails.error.id).to.equal(22565805);
    expect(state.prescriptionDetails.success).to.equal(undefined);
    expect(state.prescriptionsList[indexOfRxFilled].success).to.equal(
      undefined,
    );
    expect(state.prescriptionsList[indexOfRxFilled].error.id).to.equal(
      22565805,
    );
  });

  it('should clear error property by setting it to undefined when CLEAR_ERROR action is passed', () => {
    const initialStateWithRxList = {
      ...initialState,
      prescriptionsList: paginatedSortedListApiResponse.data.map(rx => {
        return { ...rx.attributes, error: 'error' };
      }),
    };
    const state = reduce(
      {
        type: Actions.Prescriptions.CLEAR_ERROR,
        prescriptionId: 22565805,
      },
      initialStateWithRxList,
    );
    const indexOfRxFilled = state.prescriptionsList.findIndex(
      rx => rx.prescriptionId === 22565805,
    );
    expect(state.prescriptionDetails.error).to.equal(undefined);
    expect(state.prescriptionsList[indexOfRxFilled].error).to.equal(undefined);
  });
});
