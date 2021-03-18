import moment from 'moment';
import { expect } from 'chai';
import appointmentsReducer from '../../../appointment-list/redux/reducer';
import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
} from '../../../appointment-list/redux/actions';

import { FORM_SUBMIT_SUCCEEDED } from '../../../redux/sitewide';

import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
} from '../../../utils/constants';

const initialState = {};

describe('VAOS reducer: appointments', () => {
  it('should update pending and confirmed status to be loading when calling FETCH_FUTURE_APPOINTMENTS', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.loading);
    expect(newState.pendingStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should populate confirmed with appointments with FETCH_FUTURE_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
      data: [
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
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.confirmed.length).to.equal(2);
  });

  it('should update confirmed status to be failed when calling FETCH_FUTURE_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should update pending and status to be loading when calling FETCH_PENDING_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pendingStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should populate pending with requests when FETCH_PENDING_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
      data: [
        {
          start: moment()
            .clone()
            .add(390, 'days')
            .format(),
          vaos: {},
        },
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pendingStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.pending.length).to.equal(1);
  });

  it('should update pending status to be failed when calling FETCH_PENDING_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PENDING_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pendingStatus).to.equal(FETCH_STATUS.failed);
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

  it('should populate past with appointments with FETCH_PAST_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
      startDate: '2018-01-01',
      endDate: moment().format(),
      selectedIndex: 1,
      appointments: [
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
          id: '442',
        },
      ],
      clinicInstitutionList: null,
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.facilityData['442']).to.equal(action.facilityData[0]);
  });

  it('should set facility data when fetch succeeds', () => {
    const action = {
      type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
      facilityData: [
        {
          id: '442GA',
        },
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.facilityData['442GA']).to.equal(action.facilityData[0]);
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
        confirmed: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.confirmed[0].status).to.equal(
        APPOINTMENT_STATUS.cancelled,
      );
      expect(
        newState.confirmed[0].legacyVAR.apiData.vdsAppointments[0]
          .currentStatus,
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
        pending: [appt],
        appointmentToCancel: appt,
      };
      const newState = appointmentsReducer(state, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.pending[0].legacyVAR.apiData).to.equal(action.apiData);
      expect(newState.pending[0].status).to.equal(APPOINTMENT_STATUS.cancelled);
      expect(newState.cancelAppointmentStatusVaos400).to.equal(false);
    });

    it('should set status to failed', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
        isVaos400Error: false,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.failed);
      expect(newState.cancelAppointmentStatusVaos400).to.equal(false);
    });

    it('should set status to failed', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
        isVaos400Error: true,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.true;
      expect(newState.cancelAppointmentStatus).to.equal(FETCH_STATUS.failed);
      expect(newState.cancelAppointmentStatusVaos400).to.equal(true);
    });

    it('should close modal', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CLOSED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).to.be.false;
    });
  });
  it('should reset confirmed and pending appt status after form submission', () => {
    const action = {
      type: FORM_SUBMIT_SUCCEEDED,
    };
    const state = {
      ...initialState,
      confirmedStatus: FETCH_STATUS.succeeded,
      confirmed: [{}],
      pendingStatus: FETCH_STATUS.succeeded,
      pending: [{}],
    };

    const newState = appointmentsReducer(state, action);
    expect(newState.confirmedStatus).to.equal(FETCH_STATUS.notStarted);
    expect(newState.confirmed).to.be.null;
    expect(newState.pendingStatus).to.equal(FETCH_STATUS.notStarted);
    expect(newState.pending).to.be.null;
  });

  describe('express care windows', () => {
    it('should set expressCareWindowsStatus to loading', () => {
      const action = {
        type: FETCH_EXPRESS_CARE_WINDOWS,
      };

      const newState = appointmentsReducer(initialState, action);
      expect(newState.expressCareWindowsStatus).to.equal(FETCH_STATUS.loading);
    });

    it('should filter out facilities without EC and set status on success', () => {
      const action = {
        type: FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
        settings: [
          {
            id: '983',
            customRequestSettings: [
              {
                id: 'CR1',
                typeOfCare: 'Express Care',
                supported: true,
                schedulingDays: [
                  {
                    day: 'MONDAY',
                    canSchedule: true,
                  },
                  {
                    day: 'TUESDAY',
                    canSchedule: false,
                  },
                ],
              },
            ],
          },
          {
            id: '984',
            customRequestSettings: [
              {
                id: 'CR1',
                typeOfCare: 'Express Care',
                supported: false,
                schedulingDays: [],
              },
            ],
          },
        ],
      };

      const newState = appointmentsReducer(initialState, action);
      expect(newState.expressCareWindowsStatus).to.equal(
        FETCH_STATUS.succeeded,
      );
      expect(newState.expressCareFacilities.length).to.equal(1);
      expect(newState.expressCareFacilities[0].days.length).to.equal(1);
    });

    it('should set expressCareWindowsStatus to failed', () => {
      const action = {
        type: FETCH_EXPRESS_CARE_WINDOWS_FAILED,
      };

      const newState = appointmentsReducer(initialState, action);
      expect(newState.expressCareWindowsStatus).to.equal(FETCH_STATUS.failed);
    });
  });
});
