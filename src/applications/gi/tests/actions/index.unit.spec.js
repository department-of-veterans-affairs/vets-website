import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure as setFetchFailure,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers.js';

import {
  beneficiaryZIPCodeChanged,
  FETCH_BAH_FAILED,
  FETCH_BAH_STARTED,
  FETCH_BAH_SUCCEEDED,
  fetchProfile,
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_FAILED,
  FETCH_PROFILE_SUCCEEDED,
} from '../../actions/index';

describe('beneficiaryZIPCodeChanged', () => {
  beforeEach(() => mockFetch());
  it('should return BENEFICIARY_ZIP_CODE_CHANGED when zip code is no valid for submission', () => {
    const actualAction = beneficiaryZIPCodeChanged('1111');

    const expectedAction = {
      type: 'BENEFICIARY_ZIP_CODE_CHANGED',
      beneficiaryZIP: '1111',
    };
    expect(expectedAction).to.eql(actualAction);
  });

  it('should dispatch started and success actions', done => {
    const payload = {
      data: {
        attributes: {
          mha_rate: 300, // eslint-disable-line camelcase
          mha_name: 'New York, NY', // eslint-disable-line camelcase
        },
      },
    };
    setFetchResponse(global.fetch.onFirstCall(), payload);

    const dispatch = sinon.spy();

    beneficiaryZIPCodeChanged('12345')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_BAH_STARTED,
        beneficiaryZIPFetched: '12345',
      }),
    ).to.be.true;

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: FETCH_BAH_SUCCEEDED,
          payload,
          beneficiaryZIPFetched: '12345',
        }),
      ).to.be.true;
      done();
    }, 0);
  });

  it('should dispatch started and failed actions', done => {
    const payload = {
      errors: [
        {
          title: 'error',
        },
      ],
    };
    setFetchFailure(global.fetch.onFirstCall(), payload);

    const dispatch = sinon.spy();

    beneficiaryZIPCodeChanged('12345')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_BAH_STARTED,
        beneficiaryZIPFetched: '12345',
      }),
    ).to.be.true;

    setTimeout(() => {
      const {
        beneficiaryZIPFetched,
        type,
        error,
      } = dispatch.secondCall.args[0];
      expect(type).to.eql(FETCH_BAH_FAILED);
      expect(error instanceof Error).to.be.true;
      expect(beneficiaryZIPFetched).to.eql('12345');
      done();
    }, 0);
  });

  afterEach(() => resetFetch());
});

describe('fetchProfile', () => {
  beforeEach(() => mockFetch());
  it('should dispatch a started and success action', done => {
    const institutionPayload = {
      meta: {
        version: 1,
      },
      data: {
        attributes: {
          mha_rate: 300, // eslint-disable-line camelcase
          mha_name: 'New York, NY', // eslint-disable-line camelcase
        },
      },
    };

    const constants = {
      constants: {
        AVGVABAH: 10,
        AVGDODBAH: 10,
      },
    };

    const getState = () => ({ constants });

    setFetchResponse(global.fetch.onFirstCall(), institutionPayload);

    const dispatch = sinon.spy();

    fetchProfile('12345')(dispatch, getState);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_PROFILE_STARTED,
      }),
    ).to.be.true;

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: FETCH_PROFILE_SUCCEEDED,
          payload: {
            ...institutionPayload,
            ...constants.constants,
          },
        }),
      ).to.be.true;
      done();
    }, 0);
  });

  it('should dispatch a started and failed action when the institution call fails', done => {
    const payload = {
      errors: [
        {
          title: 'error',
        },
      ],
    };
    setFetchFailure(global.fetch.onFirstCall(), payload);

    const dispatch = sinon.spy();

    fetchProfile('12345')(dispatch);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_PROFILE_STARTED,
      }),
    ).to.be.true;

    setTimeout(() => {
      const { type, err } = dispatch.secondCall.args[0];
      expect(type).to.eql(FETCH_PROFILE_FAILED);
      expect(err instanceof Error).to.be.true;
      done();
    }, 0);
  });

  it('should dispatch a started and success action when the zip code rates call fails', done => {
    const institutionPayload = {
      meta: {
        version: 1,
      },
      data: {
        attributes: {
          mha_rate: 300, // eslint-disable-line camelcase
          mha_name: 'New York, NY', // eslint-disable-line camelcase
        },
      },
    };
    const constants = {
      constants: {
        AVGVABAH: 10,
        AVGDODBAH: 10,
      },
    };

    const getState = () => ({ constants });
    setFetchResponse(global.fetch.onFirstCall(), institutionPayload);

    const dispatch = sinon.spy();

    fetchProfile('12345')(dispatch, getState);

    expect(
      dispatch.firstCall.calledWith({
        type: FETCH_PROFILE_STARTED,
      }),
    ).to.be.true;

    setTimeout(() => {
      expect(
        dispatch.secondCall.calledWith({
          type: FETCH_PROFILE_SUCCEEDED,
          payload: {
            ...institutionPayload,
            ...constants.constants,
          },
        }),
      ).to.be.true;
      done();
    }, 0);
  });
  afterEach(() => resetFetch());
});
