import { expect } from 'chai';
import {
  initialState,
  prescriptionsReducer,
} from '../../reducers/prescriptions';
import { Actions } from '../../util/actionTypes';
import paginatedSortedListApiResponse from '../fixtures/paginatedSortedListApiResponse.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';
import { categorizePrescriptions } from '../../util/helpers';

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

  it('should change prescriptionsList when GET_PAGINATED_SORTED_LIST action is passed', () => {
    const rxState = {
      ...initialState,
      prescriptionsList: paginatedSortedListApiResponse.data.map(rx => {
        return { ...rx.attributes };
      }),
      prescriptionsPagination: paginatedSortedListApiResponse.meta.pagination,
      apiError: false,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_PAGINATED_SORTED_LIST,
      response: paginatedSortedListApiResponse,
    });
    expect(state).to.deep.equal(rxState);
  });
  it('should change prescriptionsFilteredList and prescriptionsPagination when GET_PAGINATED_FILTERED_LIST action is passed', () => {
    const paginatedFilteredListApiResponse = paginatedSortedListApiResponse;
    const rxState = {
      ...initialState,
      prescriptionsFilteredList: paginatedFilteredListApiResponse.data.map(
        rx => {
          return { ...rx.attributes };
        },
      ),
      filterCount: undefined,
      prescriptionsFilteredPagination:
        paginatedFilteredListApiResponse.meta.pagination,
      apiError: false,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_PAGINATED_FILTERED_LIST,
      response: paginatedFilteredListApiResponse,
    });
    expect(state).to.deep.equal(rxState);
  });

  it('should change refillAlertList when GET_REFILL_ALERT_LIST action is passed', () => {
    const refillAlertList = [
      {
        prescriptionId: 123456,
        prescriptionName: 'Test name 1',
      },
      {
        prescriptionId: 234567,
        prescriptionName: 'Test name 2',
      },
    ];
    const rxState = {
      ...initialState,
      refillAlertList,
      apiError: false,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_REFILL_ALERT_LIST,
      response: refillAlertList,
    });
    expect(state).to.deep.equal(rxState);
  });

  it('should change refillableList and renewableList when GET_REFILLABLE_LIST action is passed', () => {
    const refillablePrescriptionsList = paginatedSortedListApiResponse.data
      .map(rx => {
        return { ...rx.attributes };
      })
      .sort((a, b) => a.prescriptionName.localeCompare(b.prescriptionName));

    const [
      refillableList,
      renewableList,
    ] = refillablePrescriptionsList.reduce(categorizePrescriptions, [[], []]);

    const rxState = {
      ...initialState,
      refillableList,
      renewableList,
      apiError: false,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_REFILLABLE_LIST,
      response: paginatedSortedListApiResponse,
    });
    expect(state).to.deep.equal(rxState);
  });

  it('should change prescriptionDetails when GET_DETAILS action is passed', () => {
    const rxState = {
      ...initialState,
      prescriptionDetails: prescriptionDetails.data.attributes,
      apiError: false,
    };
    const state = reduce({
      type: Actions.Prescriptions.GET_DETAILS,
      prescription: prescriptionDetails.data.attributes,
    });
    expect(state).to.deep.equal(rxState);
  });

  it('should change prescriptionDetails when SET_DETAILS action is passed', () => {
    const rxState = {
      ...initialState,
      prescriptionDetails: prescriptionDetails.data.attributes,
      apiError: false,
    };
    const state = reduce({
      type: Actions.Prescriptions.SET_DETAILS,
      prescription: prescriptionDetails.data.attributes,
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

  it('should clear fill action notification data', () => {
    const initialStateWithRxList = {
      ...initialState,
      refillNotification: {
        successfulMeds: ['1', '2'],
        failedMeds: ['3', '4'],
      },
    };
    const state = reduce(
      {
        type: Actions.Prescriptions.CLEAR_FILL_NOTIFICATION,
      },
      initialStateWithRxList,
    );
    expect(state.refillNotification).to.equal(undefined);
  });
});
