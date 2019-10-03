import { expect } from 'chai';
import sinon from 'sinon';

import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
  fetchRatedDisabilities,
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
