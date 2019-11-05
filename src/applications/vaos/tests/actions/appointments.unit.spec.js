import { expect } from 'chai';
import sinon from 'sinon';

import {
  fetchConfirmedAppointments,
  fetchPendingAppointments,
  fetchPastAppointments,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_CONFIRMED_APPOINTMENTS,
  FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
} from './../../actions/appointments';

let fetchMock;
let oldFetch;

const mockFetch = () => {
  oldFetch = global.fetch;
  fetchMock = sinon.stub();
  global.fetch = fetchMock;
};

const unMockFetch = () => {
  global.fetch = oldFetch;
};

describe('VAOS actions: appointments', () => {
  beforeEach(mockFetch);

  it('should fetch confirmed appointments', done => {
    const confirmed = [];
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(confirmed) }),
      }),
    });
    const thunk = fetchConfirmedAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        confirmedStatus: 'notStarted',
      },
    });
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.firstCall.args[0].type).to.eql(
          FETCH_CONFIRMED_APPOINTMENTS,
        );
        expect(dispatchSpy.secondCall.args[0].type).to.eql(
          FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
        );
        done();
      }
    };

    thunk(dispatch, getState);
  });

  it('should fetch pending appointments', done => {
    const pending = [];
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(pending) }),
      }),
    });
    const thunk = fetchPendingAppointments();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      appointments: {
        pendingStatus: 'notStarted',
      },
    });
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.firstCall.args[0].type).to.eql(
          FETCH_PENDING_APPOINTMENTS,
        );
        expect(dispatchSpy.secondCall.args[0].type).to.eql(
          FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
        );
        done();
      }
    };

    thunk(dispatch, getState);
  });

  it('should fetch past appointments', done => {
    const past = [];
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(past) }),
      }),
    });
    const thunk = fetchPastAppointments();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.firstCall.args[0].type).to.eql(
          FETCH_PAST_APPOINTMENTS,
        );
        expect(dispatchSpy.secondCall.args[0].type).to.eql(
          FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        );
        done();
      }
    };

    thunk(dispatch);
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
      const state = {
        appointments: {
          appointmentToCancel: {
            status: 'Booked',
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

  afterEach(unMockFetch);
});
