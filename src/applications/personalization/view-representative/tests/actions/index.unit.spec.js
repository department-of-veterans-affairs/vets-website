import { expect } from 'chai';
import sinon from 'sinon';

import {
  FETCH_REPRESENTATIVE_FAILED,
  FETCH_REPRESENTATIVE_SUCCESS,
  fetchRepresentative,
} from '../../actions';

import { currentRepresentative } from '../helpers';

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

describe('View Representative', () => {
  beforeEach(mockFetch);

  it('should get current Reppresentative', () => {
    fetchMock.returns({
      catch: () => ({
        then: fn =>
          fn({ ok: true, json: () => Promise.resolve(currentRepresentative) }),
      }),
    });
    const thunk = fetchRepresentative();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_REPRESENTATIVE_SUCCESS,
        );
      }
    };
    thunk(dispatch);
  });

  it('should handle an error', () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'Some status',
        },
      ],
    };
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(response) }),
      }),
    });
    const thunk = fetchRepresentative();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_REPRESENTATIVE_FAILED,
        );
      }
    };
    thunk(dispatch);
  });
  afterEach(unMockFetch);
});
