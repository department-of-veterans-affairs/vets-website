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
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
} from '../../actions/appointments';

import { FETCH_STATUS } from '../../utils/constants';

const initialState = {};

describe('VAOS reducer: appointments', () => {
  it('should update confirmedStatus to be loading when calling FETCH_CONFIRMED_APPOINTMENTS', () => {
    const action = {
      type: FETCH_CONFIRMED_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should update pastStatus to be loading when calling FETCH_PAST_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should update pendingStatus to be loading when calling FETCH_PENDING_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pendingStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should populate confirmed with appointments with FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
      data: {
        vaAppointments: [
          { appointmentTime: '05/29/2019 05:30:00' },
          {
            appointmentTime: '05/29/2019 05:32:00',
            vdsAppointments: [
              {
                currentStatus: 'CANCELLED BY CLINIC',
              },
            ],
          },
        ],
        ccAppointments: [{ startDate: '2019-04-30T05:35:00' }],
      },
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.confirmed.length).to.equal(2);
    expect(newState.confirmed[0]).to.equal(action.data.ccAppointments[0]);
  });

  it('should populate past with appointments with FETCH_PAST_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pastStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.past.length).to.equal(3);
  });

  it('should populate pending with appointments with FETCH_PENDING_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
      data: { appointmentRequests: [{ id: 1, status: 'Submitted' }] },
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pendingStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.pending.length).to.equal(1);
  });

  it('should update confirmedStatus to be failed when calling FETCH_CONFIRMED_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_CONFIRMED_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should update pastStatus to be failed when calling FETCH_PAST_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should update pendingStatus to be failed when calling FETCH_PENDING_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS_FAILED,
    };
    const newState = appointmentsReducer(initialState, action);

    expect(newState.pendingStatus).to.equal(FETCH_STATUS.failed);
  });

  describe('cancel appointment', () => {
    it('should display modal', () => {
      const action = {
        type: CANCEL_APPOINTMENT,
        appointment: {},
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(
        FETCH_STATUS.notStarted,
      );
      expect(newState.appointmentToCancel).to.equal(action.appointment);
    });

    it('should set status to loading', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.loading);
    });

    it('should set status to succeeded and remove appt', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
      };
      const appt = {};
      const state = {
        ...initialState,
        confirmed: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.confirmed.length).to.equal(0);
    });

    it('should set status to failed', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.failed);
    });

    it('should close modal', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CLOSED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.false;
      expect(newState.cancelAppointmentStatus).to.equal(
        FETCH_STATUS.notStarted,
      );
    });
  });
});
