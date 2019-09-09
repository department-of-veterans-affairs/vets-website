import { expect } from 'chai';
import appointmentsReducer from '../../reducers/appointments';
import {
  FETCH_CONFIRMED_APPOINTMENTS,
  FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
  FETCH_CONFIRMED_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
} from '../../actions/appointments';

const initialState = {};

describe('VAOS reducer: appointments', () => {
  it('should update confirmedLoading to be true when calling FETCH_CONFIRMED_APPOINTMENTS', () => {
    const action = {
      type: FETCH_CONFIRMED_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.confirmedLoading).to.be.true;
  });

  it('should update pastLoading to be true when calling FETCH_PAST_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastLoading).to.be.true;
  });

  it('should update pendingLoading to be true when calling FETCH_PENDING_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pendingLoading).to.be.true;
  });

  it('should populate confirmed with appointments with FETCH_CONFIRMED_APPOINTMENTS_SUCCEDED', () => {
    const action = {
      type: FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
      data: [{ id: 1 }, { id: 2 }],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.confirmedLoading).to.be.false;
    expect(newState.confirmed.length).to.equal(2);
  });

  it('should populate past with appointments with FETCH_PAST_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pastLoading).to.be.false;
    expect(newState.past.length).to.equal(3);
  });

  it('should populate pending with appointments with FETCH_PENDING_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
      data: { appointmentRequests: [{ id: 1, status: 'Submitted' }] },
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pendingLoading).to.be.false;
    expect(newState.pending.length).to.equal(1);
  });

  it('should update confirmedLoading to be false when calling FETCH_CONFIRMED_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_CONFIRMED_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.confirmedLoading).to.be.false;
  });

  it('should update pastLoading to be false when calling FETCH_PAST_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastLoading).to.be.false;
  });

  it('should update pendingLoading to be false when calling FETCH_PENDING_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS_FAILED,
    };
    const newState = appointmentsReducer(initialState, action);

    expect(newState.pendingLoading).to.be.false;
  });
});
