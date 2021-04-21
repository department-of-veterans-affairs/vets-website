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
  startNewAppointmentFlow,
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_REQUEST_MESSAGES,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
  FETCH_REQUEST_MESSAGES_FAILED,
} from '../../../appointment-list/redux/actions';

import { STARTED_NEW_APPOINTMENT_FLOW } from '../../../redux/sitewide';

import { getVAAppointmentMock } from '../../mocks/v0';

describe('VAOS actions: appointments', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
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

    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-get-past-appointments-started',
    );
    expect(global.window.dataLayer[1].event).to.equal('vaos-error');
    expect(global.window.dataLayer[2].event).to.equal(
      'vaos-get-past-appointments-failed',
    );
  });

  it('should not send fail action if location details fetch fails', async () => {
    const data = {
      data: [],
    };
    setFetchJSONResponse(global.fetch, data);
    setFetchJSONResponse(global.fetch.onCall(2), {
      data: [getVAAppointmentMock()],
    });
    setFetchJSONFailure(global.fetch.onCall(3), {});
    const thunk = fetchFutureAppointments();
    const dispatchSpy = sinon.spy();
    await thunk(dispatchSpy, () => ({}));
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.thirdCall.args[0].type).to.eql(
      FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
    );
    expect(dispatchSpy.callCount).to.equal(3);
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

  it('should start new appointment flow', () => {
    const action = startNewAppointmentFlow();

    expect(action).to.deep.equal({
      type: STARTED_NEW_APPOINTMENT_FLOW,
    });
  });
});
