import { expect } from 'chai';
import sinon from 'sinon';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  fetchFutureAppointments,
  fetchPastAppointments,
  fetchRequestMessages,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
  startNewAppointmentFlow,
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  FETCH_REQUEST_MESSAGES,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
  FETCH_REQUEST_MESSAGES_FAILED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
} from './../../actions/appointments';

import { APPOINTMENT_TYPES, APPOINTMENT_STATUS } from '../../utils/constants';
import { STARTED_NEW_APPOINTMENT_FLOW } from '../../actions/sitewide';

import facilityData from '../../api/facility_data.json';
import clinicData from '../../api/clinics.json';
import cancelReasons from '../../api/cancel_reasons.json';

describe('VAOS actions: appointments', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should fetch future appointments', async () => {
    const data = {
      data: [],
    };
    setFetchJSONResponse(global.fetch, data);
    setFetchJSONResponse(global.fetch.onCall(4), facilityData);
    const thunk = fetchFutureAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        futureStatus: 'notStarted',
        future: [{ facilityId: '442' }],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.thirdCall.args[0].type).to.eql(
      FETCH_FACILITY_LIST_DATA_SUCCEEDED,
    );
    expect(global.fetch.lastCall.args[0]).to.contain('ids=vha_442');
  });

  it('should dispatch fail action when fetching future appointments', async () => {
    const data = {
      data: [],
    };
    setFetchJSONFailure(global.fetch, data);
    const thunk = fetchFutureAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        futureStatus: 'notStarted',
        future: [{ facilityId: '442' }],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS_FAILED,
    );
  });

  it('should fetch past appointments', async () => {
    const data = {
      data: [],
    };
    setFetchJSONResponse(global.fetch, data);
    setFetchJSONResponse(global.fetch.onCall(4), facilityData);
    const thunk = fetchPastAppointments('2019-02-02', '2029-12-31', 1);
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        pastStatus: 'notStarted',
        past: [{ facilityId: '442' }],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(FETCH_PAST_APPOINTMENTS);
    expect(dispatchSpy.firstCall.args[0].selectedIndex).to.eql(1);
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_PAST_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.thirdCall.args[0].type).to.eql(
      FETCH_FACILITY_LIST_DATA_SUCCEEDED,
    );
    expect(global.fetch.lastCall.args[0]).to.contain('ids=vha_442');
  });

  it('should dispatch fail action when fetching past appointments', async () => {
    const data = {
      data: [],
    };
    setFetchJSONFailure(global.fetch, data);
    const thunk = fetchPastAppointments('2019-02-02', '2029-12-31');
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        pastStatus: 'notStarted',
        past: [{ facilityId: '442' }],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(FETCH_PAST_APPOINTMENTS);
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_PAST_APPOINTMENTS_FAILED,
    );
  });

  it('should fetch clinic institution mapping', async () => {
    const data = {
      data: [],
    };
    setFetchJSONResponse(global.fetch, data);
    setFetchJSONResponse(global.fetch.onCall(3), clinicData);
    setFetchJSONResponse(global.fetch.onCall(4), facilityData);
    const thunk = fetchFutureAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        futureStatus: 'notStarted',
        future: [
          {
            legacyVAR: { facilityId: '983', clinicId: '455' },
            vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
          },
          {
            legacyVAR: { facilityId: '983', clinicId: '455' },
            vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
          },
        ],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.thirdCall.args[0].type).to.eql(
      FETCH_FACILITY_LIST_DATA_SUCCEEDED,
    );
    // expect(
    //   dispatchSpy.thirdCall.args[0].clinicInstitutionList.some(
    //     clinic => clinic.locationIen === '455',
    //   ),
    // ).to.be.true;

    // expect(global.fetch.getCall(3).args[0]).to.contain(
    //   'systems/983/clinic_institutions?clinic_ids[]=455',
    // );
    // expect(global.fetch.getCall(4).args[0]).to.contain('ids=vha_442');
  });

  it('should abort fetching clinics if more than 3 systems', async () => {
    const data = {
      data: [],
    };
    setFetchJSONResponse(global.fetch, data);
    const thunk = fetchFutureAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        futureStatus: 'notStarted',
        future: [
          { legacyVAR: { facilityId: '983', clinicId: '455' } },
          { legacyVAR: { facilityId: '984', clinicId: '455' } },
          { legacyVAR: { facilityId: '985', clinicId: '455' } },
          { legacyVAR: { facilityId: '986', clinicId: '455' } },
        ],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.callCount).to.equal(2);
    expect(global.fetch.callCount).to.equal(3);
  });

  it('should not send fail action if clinic institution mapping fails', async () => {
    const data = {
      data: [],
    };
    setFetchJSONResponse(global.fetch, data);
    setFetchJSONFailure(global.fetch.onCall(3), {});
    const thunk = fetchFutureAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        futureStatus: 'notStarted',
        future: [{ facilityId: '983', clinicId: '455' }],
      },
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.callCount).to.equal(2);
    expect(global.fetch.callCount).to.equal(4);
  });

  it('should fetch request messages', async () => {
    setFetchJSONResponse(global.fetch);
    const dispatch = sinon.spy();
    const thunk = fetchRequestMessages('8a48912a6c2409b9016c525a4d490190');

    await thunk(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(FETCH_REQUEST_MESSAGES);
    expect(dispatch.secondCall.args[0].type).to.equal(
      FETCH_REQUEST_MESSAGES_SUCCEEDED,
    );
  });

  it('should dispatch failure action if messages fetch fails', async () => {
    setFetchJSONFailure(global.fetch);
    const dispatch = sinon.spy();
    const thunk = fetchRequestMessages('8a48912a6c2409b9016c525a4d490190');

    await thunk(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(FETCH_REQUEST_MESSAGES);
    expect(dispatch.secondCall.args[0].type).to.equal(
      FETCH_REQUEST_MESSAGES_FAILED,
    );
  });

  describe('cancel appointment', () => {
    it('should return cancel appointment action', () => {
      const appointment = {};
      const action = cancelAppointment(appointment);

      expect(action).to.deep.equal({
        type: CANCEL_APPOINTMENT,
        appointment,
      });
    });

    it('should fetch cancel reasons and cancel appt if has valid reason', async () => {
      const reasons = {
        data: [
          {
            id: '4',
            type: 'cancel_reason',
            attributes: {
              number: '4',
              text: 'WEATHER',
              type: 'B',
              inactive: false,
            },
          },
        ],
      };
      setFetchJSONResponse(global.fetch, reasons);
      const state = {
        appointments: {
          appointmentToCancel: {
            resourceType: 'Appointment',
            status: 'booked',
            description: 'NO ACTION TAKEN/TODAY',
            start: '2019-12-11T10:00:00-07:00',
            minutesDuration: 60,
            comment: 'Follow-up/Routine: Instructions',
            participant: [
              {
                actor: {
                  reference: 'HealthcareService/var983_455',
                  display: 'C&P BEV AUDIO FTC1',
                },
              },
            ],
            contained: null,
            legacyVAR: {
              id: '17dd714287e151195b99164cc1a8e49a',
              facilityId: '983',
              clinicId: '455',
              apiData: {
                startDate: '2020-11-07T17:00:00Z',
                clinicId: '455',
                clinicFriendlyName: null,
                facilityId: '983',
                communityCare: false,
                vdsAppointments: [
                  {
                    bookingNote: null,
                    appointmentLength: '60',
                    appointmentTime: '2020-11-07T17:00:00Z',
                    clinic: {
                      name: 'CHY OPT VAR1',
                      askForCheckIn: false,
                      facilityCode: '983',
                    },
                    type: 'REGULAR',
                    currentStatus: 'NO ACTION TAKEN/TODAY',
                  },
                ],
                vvsAppointments: [],
                id: '17dd714287e151195b99164cc1a8e49a',
              },
            },
            vaos: {
              isPastAppointment: false,
              appointmentType: 'vaAppointment',
              videoType: null,
              isCommunityCare: false,
              timeZone: null,
            },
          },
        },
      };
      const dispatch = sinon.spy();
      const thunk = confirmCancelAppointment();

      await thunk(dispatch, () => state);

      expect(dispatch.firstCall.args[0].type).to.equal(
        CANCEL_APPOINTMENT_CONFIRMED,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
        apiData: state.appointments.appointmentToCancel.legacyVAR.apiData,
      });

      expect(global.window.dataLayer[0]).to.deep.equal({
        event: 'vaos-cancel-appointment-submission',
        appointmentType: 'confirmed',
        facilityType: 'va',
      });

      expect(global.window.dataLayer[1]).to.deep.equal({
        event: 'vaos-cancel-appointment-submission-successful',
        appointmentType: 'confirmed',
        facilityType: 'va',
      });
      expect(
        JSON.parse(global.fetch.secondCall.args[1].body).cancelReason,
      ).to.equal('4');
    });

    it('should fetch cancel reasons and cancel appt', async () => {
      setFetchJSONResponse(global.fetch, cancelReasons);
      const state = {
        appointments: {
          appointmentToCancel: {
            resourceType: 'Appointment',
            status: 'booked',
            description: 'NO ACTION TAKEN/TODAY',
            start: '2019-12-11T10:00:00-07:00',
            minutesDuration: 60,
            comment: 'Follow-up/Routine: Instructions',
            participant: [
              {
                actor: {
                  reference: 'HealthcareService/var983_455',
                  display: 'C&P BEV AUDIO FTC1',
                },
              },
            ],
            contained: null,
            legacyVAR: {
              id: '17dd714287e151195b99164cc1a8e49a',
              facilityId: '983',
              clinicId: '455',
              apiData: {
                startDate: '2020-11-07T17:00:00Z',
                clinicId: '455',
                clinicFriendlyName: null,
                facilityId: '983',
                communityCare: false,
                vdsAppointments: [
                  {
                    bookingNote: null,
                    appointmentLength: '60',
                    appointmentTime: '2020-11-07T17:00:00Z',
                    clinic: {
                      name: 'CHY OPT VAR1',
                      askForCheckIn: false,
                      facilityCode: '983',
                    },
                    type: 'REGULAR',
                    currentStatus: 'NO ACTION TAKEN/TODAY',
                  },
                ],
                vvsAppointments: [],
                id: '17dd714287e151195b99164cc1a8e49a',
              },
            },
            vaos: {
              isPastAppointment: false,
              appointmentType: 'vaAppointment',
              videoType: null,
              isCommunityCare: false,
              timeZone: null,
            },
          },
        },
      };
      const dispatch = sinon.spy();
      const thunk = confirmCancelAppointment();

      await thunk(dispatch, () => state);

      expect(dispatch.firstCall.args[0].type).to.equal(
        CANCEL_APPOINTMENT_CONFIRMED,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
        apiData: state.appointments.appointmentToCancel.legacyVAR.apiData,
      });

      expect(
        JSON.parse(global.fetch.secondCall.args[1].body).cancelReason,
      ).to.equal('5');
    });

    it('should cancel request', async () => {
      setFetchJSONResponse(global.fetch, {
        data: { id: 'test', attributes: {} },
      });
      const state = {
        appointments: {
          appointmentToCancel: {
            facilityId: '983',
            status: APPOINTMENT_STATUS.booked,
            appointmentType: APPOINTMENT_TYPES.request,
            apiData: {},
          },
        },
      };
      const dispatch = sinon.spy();
      const thunk = confirmCancelAppointment();

      await thunk(dispatch, () => state);

      expect(dispatch.firstCall.args[0].type).to.equal(
        CANCEL_APPOINTMENT_CONFIRMED,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
        apiData: {
          id: 'test',
        },
      });
    });

    it('should send fail action if cancel fails', async () => {
      setFetchJSONFailure(global.fetch, { errors: [] });
      const state = {
        appointments: {
          appointmentToCancel: {
            resourceType: 'Appointment',
            status: 'booked',
            description: 'NO ACTION TAKEN/TODAY',
            start: '2019-12-11T10:00:00-07:00',
            minutesDuration: 60,
            comment: 'Follow-up/Routine: Instructions',
            participant: [
              {
                actor: {
                  reference: 'HealthcareService/var983_455',
                  display: 'C&P BEV AUDIO FTC1',
                },
              },
            ],
            contained: null,
            legacyVAR: {
              id: '17dd714287e151195b99164cc1a8e49a',
              facilityId: '983',
              clinicId: '455',
              apiData: {
                startDate: '2020-11-07T17:00:00Z',
                clinicId: '455',
                clinicFriendlyName: null,
                facilityId: '983',
                communityCare: false,
                vdsAppointments: [
                  {
                    bookingNote: null,
                    appointmentLength: '60',
                    appointmentTime: '2020-11-07T17:00:00Z',
                    clinic: {
                      name: 'CHY OPT VAR1',
                      askForCheckIn: false,
                      facilityCode: '983',
                    },
                    type: 'REGULAR',
                    currentStatus: 'NO ACTION TAKEN/TODAY',
                  },
                ],
                vvsAppointments: [],
                id: '17dd714287e151195b99164cc1a8e49a',
              },
            },
            vaos: {
              isPastAppointment: false,
              appointmentType: 'vaAppointment',
              videoType: null,
              isCommunityCare: false,
              timeZone: null,
            },
          },
        },
      };
      const dispatch = sinon.spy();
      const thunk = confirmCancelAppointment();

      await thunk(dispatch, () => state);

      expect(dispatch.firstCall.args[0].type).to.equal(
        CANCEL_APPOINTMENT_CONFIRMED,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
      });
      const dataLayer = global.window.dataLayer;

      expect(dataLayer[1]).to.deep.equal({
        event: 'vaos-cancel-appointment-submission-failed',
        appointmentType: 'confirmed',
        facilityType: 'va',
      });
      expect(dataLayer[2]).to.deep.equal({
        flow: undefined,
        'health-TypeOfCare': undefined,
        'health-ReasonForAppointment': undefined,
        'error-key': undefined,
        appointmentType: undefined,
        facilityType: undefined,
      });
    });

    it('should send close cancel action', () => {
      const action = closeCancelAppointment();

      expect(action).to.deep.equal({
        type: CANCEL_APPOINTMENT_CLOSED,
      });
    });
  });
  it('should start new appointment flow', () => {
    const action = startNewAppointmentFlow();

    expect(action).to.deep.equal({
      type: STARTED_NEW_APPOINTMENT_FLOW,
    });
  });
});
