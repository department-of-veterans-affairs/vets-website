import sinon from 'sinon';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers.js';

import * as actions from '../../actions';

describe('loadConnectedAccounts', () => {
  beforeEach(() => mockFetch());

  test('should receive loaded and success actions', done => {
    const payload = {
      data: [
        {
          id: 'test-id',
          type: 'connected-accounts',
          attributes: {
            title: 'App',
          },
        },
      ],
    };
    const dispatch = sinon.spy();
    setFetchResponse(global.fetch.onFirstCall(), payload);

    actions.loadConnectedAccounts()(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: actions.LOADING_CONNECTED_ACCOUNTS,
      }),
    ).toBe(true);

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: actions.FINISHED_CONNECTED_ACCOUNTS,
          data: payload.data,
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  test('should receive loaded and error actions', done => {
    const payload = { errors: [{ status: 404 }] };

    setFetchFailure(global.fetch.onFirstCall(), payload);
    const dispatch = sinon.spy();

    actions.loadConnectedAccounts()(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: actions.LOADING_CONNECTED_ACCOUNTS,
      }),
    ).toBe(true);

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: actions.ERROR_CONNECTED_ACCOUNTS,
          errors: payload.errors,
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  afterEach(() => resetFetch());
});

describe('deleteConnectedAccount', () => {
  beforeEach(() => mockFetch());

  test('should dispatch loading and success', done => {
    const dispatch = sinon.spy();
    setFetchResponse(global.fetch.onFirstCall());

    actions.deleteConnectedAccount('fake-id')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: actions.DELETING_CONNECTED_ACCOUNT,
        accountId: 'fake-id',
      }),
    ).toBe(true);

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: actions.FINISHED_DELETING_CONNECTED_ACCOUNT,
          accountId: 'fake-id',
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  test('should receive loaded and error actions', done => {
    const payload = { errors: [{ status: 404 }] };

    setFetchFailure(global.fetch.onFirstCall(), payload);
    const dispatch = sinon.spy();

    actions.deleteConnectedAccount('fake-id')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: actions.DELETING_CONNECTED_ACCOUNT,
        accountId: 'fake-id',
      }),
    ).toBe(true);

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: actions.ERROR_DELETING_CONNECTED_ACCOUNT,
          accountId: 'fake-id',
          errors: payload.errors,
        }),
      ).toBe(true);
      done();
    }, 0);
  });

  afterEach(() => resetFetch());
});
