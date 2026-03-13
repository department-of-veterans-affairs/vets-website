import { expect } from 'chai';
import sinon from 'sinon';

import * as actions from 'platform/user/profile/actions';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import { mockApiRequest } from 'platform/testing/unit/helpers';

describe('profile actions', () => {
  let dispatch;
  let recordEventSpy;

  beforeEach(() => {
    dispatch = sinon.spy();
    recordEventSpy = sinon.spy();
  });

  it('creates UPDATE_PROFILE_FIELDS when updating profile fields', () => {
    const expectedAction = {
      type: actions.UPDATE_PROFILE_FIELDS,
      payload: { test: 'data' },
    };
    expect(actions.updateProfileFields({ test: 'data' })).to.deep.equal(
      expectedAction,
    );
  });

  // Testing thunk around refreshProfile user request
  it('handles successful profile refresh, and triggers successful GA event', async () => {
    const mockResponse = {
      data: { attributes: { profile: { signIn: { serviceName: 'idme' } } } },
    };
    mockApiRequest(mockResponse);

    const expectedActions = [
      { type: actions.UPDATE_PROFILE_FIELDS, payload: mockResponse },
    ];

    const resultOfFetch = await actions.refreshProfile(
      false,
      {
        local: 'none',
      },
      recordEventSpy,
    )(dispatch);

    expect(dispatch.firstCall.args[0]).to.eql(expectedActions[0]);

    expect(resultOfFetch).to.deep.equal(mockResponse);

    expect(recordEventSpy.firstCall.args[0]).to.eql({
      event: 'api_call',
      'api-name': 'GET /v0/user',
      'api-status': 'successful',
    });
  });

  it('handles failed profile refresh, and triggers failure GA event', async () => {
    const errorResponse = { errors: [{ title: 'API Error' }] };
    mockApiRequest(errorResponse); // Simulate API failure

    const expectedActions = [
      { type: actions.UPDATE_PROFILE_FIELDS, payload: errorResponse },
    ];

    await actions.refreshProfile(false, { local: 'none' }, recordEventSpy)(
      dispatch,
    );

    expect(dispatch.firstCall.args[0]).to.eql(expectedActions[0]);

    expect(recordEventSpy.firstCall.args[0]).to.eql({
      event: 'api_call',
      'api-name': 'GET /v0/user',
      'api-status': 'failed',
      'error-key': 'API Error',
    });
  });
});

describe('initializeProfile', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
  });

  it('dispatches updateLoggedInStatus(true) before profileLoadingFinished on success', async () => {
    await actions.initializeProfile()(dispatch);

    const callTypes = dispatch.args.map(([arg]) => arg?.type).filter(Boolean);
    const loginIdx = callTypes.indexOf(UPDATE_LOGGEDIN_STATUS);
    const finishedIdx = callTypes.indexOf(actions.PROFILE_LOADING_FINISHED);

    expect(loginIdx).to.be.at.least(0);
    expect(finishedIdx).to.be.at.least(0);
    expect(loginIdx).to.be.lessThan(
      finishedIdx,
      'updateLoggedInStatus must fire before profileLoadingFinished so the post-auth nav gate has a window to activate',
    );
  });

  it('passes value:true to updateLoggedInStatus on success', async () => {
    await actions.initializeProfile()(dispatch);

    const loginCall = dispatch.args.find(
      ([arg]) => arg?.type === UPDATE_LOGGEDIN_STATUS,
    );
    expect(loginCall[0].value).to.be.true;
  });

  it('dispatches updateLoggedInStatus(false) on a non-network fetch error', async () => {
    // Make dispatch throw a non-TypeError when called with the refreshProfile thunk
    dispatch = sinon.stub().callsFake(arg => {
      if (typeof arg === 'function') throw new Error('server error');
    });

    await actions.initializeProfile()(dispatch);

    const logoutCall = dispatch.args.find(
      ([arg]) => arg?.type === UPDATE_LOGGEDIN_STATUS,
    );
    expect(logoutCall[0].value).to.be.false;
  });

  it('dispatches profileError instead of logging out on a network-cancelled fetch', async () => {
    dispatch = sinon.stub().callsFake(arg => {
      if (typeof arg === 'function') {
        throw new TypeError('Failed to fetch');
      }
    });

    await actions.initializeProfile()(dispatch);

    const callTypes = dispatch.args.map(([arg]) => arg?.type).filter(Boolean);
    expect(callTypes).to.include(actions.PROFILE_ERROR);
    expect(callTypes).not.to.include(UPDATE_LOGGEDIN_STATUS);
  });
});

describe('extractProfileErrors', () => {
  it('extracts errors from meta object', () => {
    const mockDataPayload = {
      meta: {
        errors: [
          { description: 'Meta error 1' },
          { description: 'Meta error 2' },
        ],
      },
    };
    const result = actions.extractProfileErrors(mockDataPayload);
    expect(result).to.equal('Meta error 1 | Meta error 2');
  });

  it('extracts errors from main errors object', () => {
    const mockDataPayload = {
      errors: [{ title: 'Main error 1' }, { title: 'Main error 2' }],
    };
    const result = actions.extractProfileErrors(mockDataPayload);
    expect(result).to.equal('Main error 1 | Main error 2');
  });

  it('extracts errors from both meta and main errors object', () => {
    const mockDataPayload = {
      meta: {
        errors: [{ description: 'Meta error' }],
      },
      errors: [{ title: 'Main error' }],
    };
    const result = actions.extractProfileErrors(mockDataPayload);
    expect(result).to.equal('Meta errorMain error');
  });

  it('returns default message if no errors found', () => {
    const mockDataPayload = {};
    const result = actions.extractProfileErrors(mockDataPayload);
    expect(result).to.equal('No error messages found');
  });
});
