import moment from 'moment';
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

import { FETCH_STATUS } from '../../utils/constants';

const initialState = {};

describe('VAOS reducer: appointments', () => {
  test('should update futureStatus to be loading when calling FETCH_FUTURE_APPOINTMENTS', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).toBe(FETCH_STATUS.loading);
  });

  test('should populate future with appointments with FETCH_FUTURE_APPOINTMENTS_SUCCEEDED', () => {
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
          // Cancelled should not show
          {
            vdsAppointments: [
              {
                currentStatus: 'CANCELLED BY CLINIC',
              },
            ],
          },
        ],
        [
          {
            appointmentTime: '05/29/2099 05:30:00',
            timeZone: 'UTC',
            appointmentRequestId: '1',
          },
        ],
        [{ optionDate1: '05/29/2099' }],
      ],
      today: moment(),
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.futureStatus).toBe(FETCH_STATUS.succeeded);
    expect(newState.future.length).toBe(5);
  });

  test('should update futureStatus to be failed when calling FETCH_FUTURE_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_FUTURE_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.futureStatus).toBe(FETCH_STATUS.failed);
  });

  test('should update pastStatus to be loading when calling FETCH_PAST_APPOINTMENTS', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).toBe(FETCH_STATUS.loading);
  });

  test('should populate confirmed with appointments with FETCH_PAST_APPOINTMENTS_SUCCEEDED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
      startDate: '2018-01-01',
      endDate: moment().format(),
      data: [
        [
          { startDate: '2019-04-30T05:35:00', facilityId: '984' },
          // appointment before start date should not show
          { startDate: '2017-04-30T05:35:00', facilityId: '984' },
          // appointment 1 hour in the future should not show
          {
            startDate: moment()
              .add(650, 'minutes')
              .format(),
          },
          // appointment 30 min ago should show
          {
            startDate: moment()
              .subtract(30, 'minutes')
              .format(),
          },
          // Cancelled should show
          {
            appointmentTime: '05/29/2019 05:30:00',
            timeZone: '+08:00 WITA',
            vdsAppointments: [
              {
                currentStatus: 'CANCELLED BY CLINIC',
              },
            ],
          },
        ],
        [
          {
            id: '8a4885896a22f88f016a2c8834b1005d',
            appointmentRequestId: '8a4885896a22f88f016a2c8834b1005d',
            distanceEligibleConfirmed: true,
            name: { firstName: '', lastName: '' },
            providerPractice: 'Atlantic Medical Care',
            providerPhone: '(407) 555-1212',
            address: {
              street: '123 Main Street',
              city: 'Orlando',
              state: 'FL',
              zipCode: '32826',
            },
            instructionsToVeteran:
              'Please arrive 15 minutes ahead of appointment.',
            appointmentTime: '09/25/2019 03:45:00',
            timeZone: '+08:00 WITA',
          },
        ],
      ],
      today: moment(),
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.pastStatus).toBe(FETCH_STATUS.succeeded);
    expect(newState.past.length).toBe(4);
  });

  test('should update pastStatus to be failed when calling FETCH_PAST_APPOINTMENTS_FAILED', () => {
    const action = {
      type: FETCH_PAST_APPOINTMENTS_FAILED,
    };

    const newState = appointmentsReducer(initialState, action);

    expect(newState.pastStatus).toBe(FETCH_STATUS.failed);
  });

  test('should populate requests with messages with FETCH_REQUEST_MESSAGES_SUCCEEDED', () => {
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
    expect(newState.requestMessages[action.requestId].length).toBe(1);
  });

  test('should set facility data when fetch succeeds', () => {
    const action = {
      type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
      facilityData: [
        {
          uniqueId: '442',
        },
      ],
      clinicInstitutionList: null,
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.facilityData['442']).toBe(action.facilityData[0]);
  });

  test('should set clinic mapping data when fetch succeeds', () => {
    const action = {
      type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
      facilityData: [
        {
          uniqueId: '442GA',
        },
      ],
      clinicInstitutionList: [
        {
          locationIen: '455',
          institutionCode: '442GA',
          systemId: '442',
        },
      ],
    };

    const newState = appointmentsReducer(initialState, action);
    expect(newState.systemClinicToFacilityMap['442_455']).toBe(
      action.facilityData[0],
    );
  });

  describe('cancel appointment', () => {
    test('should display modal', () => {
      const action = {
        type: CANCEL_APPOINTMENT,
        appointment: {},
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).toBe(true);
      expect(newState.cancelAppointmentStatus).toBe(FETCH_STATUS.notStarted);
      expect(newState.appointmentToCancel).toBe(action.appointment);
    });

    test('should set status to loading', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).toBe(true);
      expect(newState.cancelAppointmentStatus).toBe(FETCH_STATUS.loading);
    });

    test('should set status to succeeded and set confirmed appt to cancelled', () => {
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

      expect(newState.showCancelModal).toBe(true);
      expect(newState.cancelAppointmentStatus).toBe(FETCH_STATUS.succeeded);
      expect(newState.future[0].vdsAppointments[0].currentStatus).toBe(
        'CANCELLED BY PATIENT',
      );
    });

    test('should set status to succeeded and set request to cancelled', () => {
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

      expect(newState.showCancelModal).toBe(true);
      expect(newState.cancelAppointmentStatus).toBe(FETCH_STATUS.succeeded);
      expect(newState.future[0].status).toBe('Cancelled');
    });

    test('should set status to failed', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).toBe(true);
      expect(newState.cancelAppointmentStatus).toBe(FETCH_STATUS.failed);
    });

    test('should close modal', () => {
      const action = {
        type: CANCEL_APPOINTMENT_CLOSED,
      };
      const newState = appointmentsReducer(initialState, action);

      expect(newState.showCancelModal).toBe(false);
      expect(newState.cancelAppointmentStatus).toBe(FETCH_STATUS.notStarted);
    });
  });
  test('should reset future appt status after form submission', () => {
    const action = {
      type: FORM_SUBMIT_SUCCEEDED,
    };
    const state = {
      ...initialState,
      futureStatus: FETCH_STATUS.succeeded,
      future: [{}],
    };

    const newState = appointmentsReducer(state, action);
    expect(newState.futureStatus).toBe(FETCH_STATUS.notStarted);
    expect(newState.future).toBeNull();
  });
});
