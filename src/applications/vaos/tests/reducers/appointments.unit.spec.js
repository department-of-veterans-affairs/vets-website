import moment from 'moment';
import { expect } from 'chai';
import appointmentsReducer from '../../reducers/appointments';
import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
} from '../../actions/appointments';

import { FORM_CLOSED_CONFIRMATION_PAGE } from '../../actions/newAppointment';

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

  it('should populate confirmed with appointments with FETCH_FUTURE_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
      data: [
        [
          { startDate: '2099-04-30T05:35:00', facilityId: '984' },
          // appointment more than 1 hour ago should not show
          {
            startDate: moment()
              .subtract(65, 'minutes')
              .format(),
          },
          // appointment 30 min ago should show
          {
            startDate: moment()
              .subtract(30, 'minutes')
              .format(),
          },
          // video appointment less than 4 hours ago should show
          {
            vvsAppointments: [
              {
                dateTime: moment()
                  .subtract(230, 'minutes')
                  .format(),
              },
            ],
          },
          // video appointment more than 4 hours ago should not show
          {
            vvsAppointments: [
              {
                dateTime: moment()
                  .subtract(245, 'minutes')
                  .format(),
              },
            ],
          },
        ],
        [
          { appointmentTime: '05/29/2099 05:30:00', appointmentRequestId: '1' },
          // Cancelled should not show
          {
            appointmentTime: '05/29/2099 05:32:00',
            appointmentRequestId: '2',
            vdsAppointments: [
              {
                currentStatus: 'CANCELLED BY CLINIC',
              },
            ],
          },
        ],
        [{ optionDate1: '05/29/2099' }],
      ],
      today: moment(),
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.futureStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.future.length).to.equal(5);
  });

  it('should populate requests with messages with FETCH_REQUEST_MESSAGES_SUCCEEDED', () => {
    const action = {
      type: FETCH_REQUEST_MESSAGES_SUCCEEDED,
      requestId: 1,
      messages: [
        {
          attributes: {
            messageText: 'test',
          },
        },
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.requestMessages[action.requestId].length).to.equal(1);
  });

  it('should update confirmedStatus to be failed when calling FETCH_FUTURE_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should set facility data when fetch succeeds', () => {
    const action = {
      type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
      facilityData: [
        {
          uniqueId: '442',
        },
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.facilityData['442']).to.equal(action.facilityData[0]);
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

    it('should set status to succeeded and set confirmed appt to cancelled', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
      };
      const appt = {
        clinicId: '123',
        vdsAppointments: [
          {
            currentStatus: 'FUTURE',
          },
        ],
      };
      const state = {
        ...initialState,
        future: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.future[0].vdsAppointments[0].currentStatus).to.equal(
        'CANCELLED BY PATIENT',
      );
    });

    it('should set status to succeeded and set request to cancelled', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
      };
      const appt = {
        status: 'Submitted',
      };
      const state = {
        ...initialState,
        future: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.future[0].status).to.equal('Cancelled');
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
  it('should reset future appt status after confirmation page is closed', () => {
    const action = {
      type: FORM_CLOSED_CONFIRMATION_PAGE,
    };
    const state = {
      ...initialState,
      futureStatus: FETCH_STATUS.succeeded,
      future: [{}],
    };

    const newState = appointmentsReducer(state, action);
    expect(newState.futureStatus).to.equal(FETCH_STATUS.notStarted);
    expect(newState.future).to.be.null;
  });
});
