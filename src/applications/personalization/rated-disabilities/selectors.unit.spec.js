import { expect } from 'chai';

import {
  hasTotalDisabilityClientError,
  hasTotalDisabilityServerError,
} from './selectors';

describe('hasTotalDisabilityServerError', () => {
  it('returns `true` when there is a 500 error in the Redux state', () => {
    const state = {
      totalRating: {
        loading: false,
        error: {
          code: '500',
          detail: 'server error',
        },
        totalDisabilityRating: null,
        disabilityDecisionTypeName: null,
      },
    };
    expect(hasTotalDisabilityServerError(state)).to.be.true;
  });
  it('returns `false` when there is a 400 error in the Redux state', () => {
    const state = {
      totalRating: {
        loading: false,
        error: {
          code: '403',
          detail: 'User does not have access to the requested resource',
        },
        totalDisabilityRating: null,
        disabilityDecisionTypeName: null,
      },
    };
    expect(hasTotalDisabilityServerError(state)).to.be.false;
  });
  it('returns `false` when there is no error in the Redux state', () => {
    const state = {
      totalRating: {
        loading: false,
        error: null,
        totalDisabilityRating: 100,
      },
    };
    expect(hasTotalDisabilityServerError(state)).to.be.false;
  });
});

describe('hasTotalDisabilityClientError', () => {
  it('returns `false` when there is a 500 error in the Redux state', () => {
    const state = {
      totalRating: {
        loading: false,
        error: {
          code: '500',
          detail: 'server error',
        },
        totalDisabilityRating: null,
        disabilityDecisionTypeName: null,
      },
    };
    expect(hasTotalDisabilityClientError(state)).to.be.false;
  });
  it('returns `true` when there is a 400 error in the Redux state', () => {
    const state = {
      totalRating: {
        loading: false,
        error: {
          code: '403',
          detail: 'User does not have access to the requested resource',
        },
        totalDisabilityRating: null,
        disabilityDecisionTypeName: null,
      },
    };
    expect(hasTotalDisabilityClientError(state)).to.be.true;
  });
  it('returns `false` when there is no error in the Redux state', () => {
    const state = {
      totalRating: {
        loading: false,
        error: null,
        totalDisabilityRating: 100,
      },
    };
    expect(hasTotalDisabilityClientError(state)).to.be.false;
  });
});
