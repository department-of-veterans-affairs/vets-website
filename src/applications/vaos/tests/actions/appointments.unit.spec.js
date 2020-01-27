import { expect } from 'chai';
import sinon from 'sinon';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import {
  fetchFutureAppointments,
  fetchRequestMessages,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  FETCH_REQUEST_MESSAGES,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
} from './../../actions/appointments';

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
    expect(dispatchSpy.thirdCall.args[0].type).to.eql(
      FETCH_FACILITY_LIST_DATA_SUCCEEDED,
    );
    expect(
      dispatchSpy.thirdCall.args[0].clinicInstitutionList.some(
        clinic => clinic.locationIen === '455',
      ),
    ).to.be.true;

    expect(global.fetch.getCall(3).args[0]).to.contain(
      'systems/983/clinic_institutions?clinic_ids[]=455',
    );
    expect(global.fetch.getCall(4).args[0]).to.contain('ids=vha_442');
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

  describe('cancel appointment', () => {
    it('should return cancel appointment action', () => {
      const appointment = {};
      const action = cancelAppointment(appointment);

      expect(action).to.deep.equal({
        type: CANCEL_APPOINTMENT,
        appointment,
      });
    });

    it('should fetch cancel reasons and cancel appt', async () => {
      setFetchJSONResponse(global.fetch, cancelReasons);
      const state = {
        appointments: {
          appointmentToCancel: {
            facilityId: '983',
            vdsAppointments: [
              {
                clinic: {},
              },
            ],
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
      });
    });

    it('should cancel request', async () => {
      setFetchJSONResponse(global.fetch, {});
      const state = {
        appointments: {
          appointmentToCancel: {
            status: 'Submitted',
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
      });
    });

    it('should send fail action if cancel fails', async () => {
      const state = {
        appointments: {
          appointmentToCancel: null,
        },
      };
      const dispatch = sinon.spy();
      const thunk = confirmCancelAppointment();

      await thunk(dispatch, () => state);

      expect(dispatch.firstCall.args[0].type).to.equal(
        CANCEL_APPOINTMENT_CONFIRMED,
      );
      // This fails because we don't have a valid appointment object
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
      });
    });

    it('should send close cancel action', () => {
      const action = closeCancelAppointment();

      expect(action).to.deep.equal({
        type: CANCEL_APPOINTMENT_CLOSED,
      });
    });
  });
});
