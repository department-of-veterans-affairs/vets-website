import { expect } from 'chai';
import appointmentsReducer from '../../reducers/appointments';
import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
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
  it('should update cutureStatus to be loading when calling FETCH_FUTURE_APPOINTMENTS', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should update pastStatus to be loading when calling FETCH_PAST_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should populate confirmed with appointments with FETCH_FUTURE_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
      data: [
        [
          { appointmentTime: '05/29/2099 05:30:00' },
          {
            appointmentTime: '05/29/2099 05:32:00',
            vdsAppointments: [
              {
                currentStatus: 'CANCELLED BY CLINIC',
              },
            ],
          },
        ],
        [{ startDate: '2099-04-30T05:35:00' }],
        [{ optionDate1: '05/29/2099' }],
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.futureStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.future.length).to.equal(3);
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

  it('should update confirmedStatus to be failed when calling FETCH_FUTURE_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should update pastStatus to be failed when calling FETCH_PAST_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).to.equal(FETCH_STATUS.failed);
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
