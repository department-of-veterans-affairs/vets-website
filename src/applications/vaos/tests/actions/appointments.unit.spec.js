import { expect } from 'chai';
import sinon from 'sinon';

import {
  fetchConfirmedAppointments,
  fetchPendingAppointments,
  fetchPastAppointments,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_CONFIRMED_APPOINTMENTS,
  FETCH_CONFIRMED_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
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

  afterEach(unMockFetch);
});
