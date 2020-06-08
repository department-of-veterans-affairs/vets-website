import moment from 'moment';
import { expect } from 'chai';
import appointmentsReducer from '../../reducers/appointments';
import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
} from '../../actions/appointments';

import { FORM_SUBMIT_SUCCEEDED } from '../../actions/sitewide';

import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
} from '../../utils/constants';

const initialState = {};

describe('VAOS reducer: appointments', () => {
  it('should update futureStatus to be loading when calling FETCH_FUTURE_APPOINTMENTS', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should populate future with appointments with FETCH_FUTURE_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
      data: [
        [
          {
            start: moment()
              .clone()
              .add(60, 'days')
              .format(),
            facilityId: '984',
            vaos: {},
          },
          {
            start: moment()
              .clone()
              .add(390, 'days')
              .format(),
            facilityId: '984',
            vaos: {},
          },
        ],
        // pending appointments will show
        [
          {
            status: 'Submitted',
            appointmentType: 'Primary Care',
            optionDate1: moment()
              .add(2, 'days')
              .format('MM/DD/YYYY'),
          },
        ],
      ],
      today: moment(),
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.futureStatus).to.equal(FETCH_STATUS.succeeded);
    // console.log(newState.future);
    expect(newState.future.length).to.equal(3);
    expect(
      moment(newState.future[0].start).isBefore(
        moment(newState.future[1].start),
      ),
    ).to.be.true;
  });

  it('should update futureStatus to be failed when calling FETCH_FUTURE_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should update pastStatus to be loading when calling FETCH_PAST_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS,
      selectedIndex: 1,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).to.equal(FETCH_STATUS.loading);
    expect(newState.pastSelectedIndex).to.equal(1);
  });

  it('should populate confirmed with appointments with FETCH_PAST_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
      startDate: '2018-01-01',
      endDate: moment().format(),
      selectedIndex: 1,
      data: [
        {
          start: '2019-04-30T05:35:00',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        {
          start: '2019-04-30T05:35:00',
          vaos: { appointmentType: APPOINTMENT_TYPES.ccAppointment },
        },
        // appointment before start date should not show
        {
          start: '2017-04-30T05:35:00',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment 1 hour in the future should not show
        {
          start: moment()
            .add(650, 'minutes')
            .format(),
          vaos: { appointmentType: APPOINTMENT_TYPES.ccAppointment },
        },
        // appointment 30 min ago should show
        {
          start: moment()
            .subtract(30, 'minutes')
            .format(),
          vaos: { appointmentType: APPOINTMENT_TYPES.ccAppointment },
        },
        // Cancelled should show
        {
          start: moment()
            .subtract(20, 'minutes')
            .format(),
          description: 'CANCELLED BY CLINIC',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
      ],
      today: moment(),
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pastStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.past.length).to.equal(4);
    expect(
      moment(newState.past[0].start).isAfter(moment(newState.past[1].start)),
    ).to.be.true;
  });

  it('should update pastStatus to be failed when calling FETCH_PAST_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).to.equal(FETCH_STATUS.failed);
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

  it('should set facility data when fetch succeeds', () => {
    const action = {
      type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
      facilityData: [
        {
          id: 'var442',
        },
      ],
      clinicInstitutionList: null,
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.facilityData.var442).to.equal(action.facilityData[0]);
  });

  it('should set facility data when fetch succeeds', () => {
    const action = {
      type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
      facilityData: [
        {
          id: 'var442GA',
        },
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.facilityData.var442GA).to.equal(action.facilityData[0]);
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
        vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        legacyVAR: {
          apiData: { vdsAppointments: [{}] },
          clinicId: '123',
        },

        description: APPOINTMENT_STATUS.booked,
      };
      const state = {
        ...initialState,
        future: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.future[0].status).to.equal(APPOINTMENT_STATUS.cancelled);
      expect(
        newState.future[0].legacyVAR.apiData.vdsAppointments[0].currentStatus,
      ).to.equal('CANCELLED BY PATIENT');
    });

    it('should set status to succeeded and set request to cancelled', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
        apiData: {},
      };
      const appt = {
        appointmentType: APPOINTMENT_TYPES.request,
        status: APPOINTMENT_STATUS.booked,
      };
      const state = {
        ...initialState,
        future: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.future[0].apiData).to.equal(action.apiData);
      expect(newState.future[0].status).to.equal(APPOINTMENT_STATUS.cancelled);
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
  it('should reset future appt status after form submission', () => {
    const action = {
      type: FORM_SUBMIT_SUCCEEDED,
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
