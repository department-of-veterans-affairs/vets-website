import sinon from 'sinon';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  fetchPowerOfAttorney,
  fetchPowerOfAttorneyStarted,
  fetchPowerOfAttorneySucceeded,
  fetchPowerOfAttorneyFailed,
  FETCH_POWER_OF_ATTORNEY_STARTED,
  FETCH_POWER_OF_ATTORNEY_SUCCEEDED,
  FETCH_POWER_OF_ATTORNEY_FAILED,
  POA_PATH,
} from '@@profile/actions/powerOfAttorney';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';

import mockResponse from '../fixtures/power-of-attorney-success.json';
import error500 from '../fixtures/500.json';

describe('powerOfAttorney actions', () => {
  const endpointUrl = `${environment.API_URL}/v0${POA_PATH}`;

  let server = null;
  let apiRequestStub = null;

  beforeEach(() => {
    apiRequestStub = sinon
      .stub(apiRequest, 'bind')
      .returns(sinon.stub().resolves(mockResponse));
  });

  afterEach(() => {
    server.resetHandlers();
    apiRequestStub.restore();
  });

  after(() => {
    server.close();
  });

  it('should dispatch FETCH_POWER_OF_ATTORNEY_STARTED on fetch start', async () => {
    server = setupServer(
      rest.get(`${endpointUrl}`, (_, res, ctx) => {
        return res(ctx.json(mockResponse), ctx.status(200));
      }),
    );

    server.listen();

    const dispatchSpy = sinon.spy();
    const actionCreator = fetchPowerOfAttorney();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY_STARTED,
    });
  });

  it('should dispatch FETCH_POWER_OF_ATTORNEY_SUCCEEDED with response on success', async () => {
    server = setupServer(
      rest.get(`${endpointUrl}`, (_, res, ctx) => {
        return res(ctx.json(mockResponse), ctx.status(200));
      }),
    );

    server.listen();

    const dispatchSpy = sinon.spy();
    const actionCreator = fetchPowerOfAttorney();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY_SUCCEEDED,
      payload: mockResponse,
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_POWER_OF_ATTORNEY_FAILED with error on failure', async () => {
    server = setupServer(
      rest.get(endpointUrl, (_, res, ctx) => {
        return res(ctx.json(error500), ctx.status(500));
      }),
    );

    server.listen();

    const dispatchSpy = sinon.spy();
    const actionCreator = fetchPowerOfAttorney();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY_FAILED,
      payload: error500,
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  describe('fetchPowerOfAttorneyStarted action creator', () => {
    it('should create an action to start fetching power of attorney', () => {
      const expectedAction = {
        type: FETCH_POWER_OF_ATTORNEY_STARTED,
      };
      expect(fetchPowerOfAttorneyStarted()).to.eql(expectedAction);
    });
  });

  describe('fetchPowerOfAttorneySucceeded action creator', () => {
    it('should create an action with payload on success', () => {
      const payload = mockResponse;
      const expectedAction = {
        type: FETCH_POWER_OF_ATTORNEY_SUCCEEDED,
        payload,
      };
      expect(fetchPowerOfAttorneySucceeded(payload)).to.eql(expectedAction);
    });
  });

  describe('fetchPowerOfAttorneyFailed action creator', () => {
    it('should create an action with payload on failure', () => {
      const payload = error500;
      const expectedAction = {
        type: FETCH_POWER_OF_ATTORNEY_FAILED,
        payload,
      };
      expect(fetchPowerOfAttorneyFailed(payload)).to.eql(expectedAction);
    });
  });
});
