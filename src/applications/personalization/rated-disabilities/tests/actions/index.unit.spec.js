import { expect } from 'chai';
import sinon from 'sinon';

import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
} from '../../actions';

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

describe('Rated Disabilities actions: fetchRatedDisabilities', () => {
  beforeEach(mockFetch);

  it('should fetch rated disabilities', () => {
    const disabilities = [
      {
        name: 'PTSD',
        date: '01/01/1990',
        related: true,
      },
      {
        name: 'Head Trauma',
        date: '01/01/1990',
        related: false,
      },
    ];

    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(disabilities) }),
      }),
    });
    const thunk = fetchRatedDisabilities();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_RATED_DISABILITIES_SUCCESS,
        );
      }
    };
    thunk(dispatch);
  });

  it('should handle an error returned', () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'some status',
        },
      ],
    };
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(response) }),
      }),
    });
    const thunk = fetchRatedDisabilities();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_RATED_DISABILITIES_FAILED,
        );
      }
    };
    thunk(dispatch);
  });
  afterEach(unMockFetch);
});

describe('Rated Disabilities actions: fetchRatedDisabilities', () => {
  beforeEach(mockFetch);

  it('should fetch the total rating', () => {
    const total = { userPercentOfDisability: 80 };

    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(total) }),
      }),
    });

    const thunk = fetchTotalDisabilityRating();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_TOTAL_RATING_SUCCEEDED,
        );
      }
    };
    thunk(dispatch);
  });

  it('should handle an error returned', () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'some status',
        },
      ],
    };
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(response) }),
      }),
    });
    const thunk = fetchTotalDisabilityRating();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_TOTAL_RATING_FAILED,
        );
      }
    };
    thunk(dispatch);
  });

  afterEach(unMockFetch);
});
