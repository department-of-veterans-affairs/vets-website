import { expect } from 'chai';
import sinon from 'sinon';
import { dependents } from './helpers';

import {
  FETCH_ALL_DEPENDENTS_SUCCESS,
  FETCH_ALL_DEPENDENTS_FAILED,
  fetchAllDependents,
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

describe('View Disabilities actions: fetchAllDependents', () => {
  beforeEach(mockFetch);

  it('should fetch rated disabilities', () => {
    fetchMock.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(dependents) }),
      }),
    });
    const makeTheFetch = fetchAllDependents();

    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        FETCH_ALL_DEPENDENTS_SUCCESS,
      );
      expect(dispatchSpy.firstCall.args[1].errors).to.equal(undefined);
    };
    makeTheFetch(dispatch);
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
    const thunk = fetchAllDependents();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      expect(dispatchSpy.calledOnce).to.be.true;
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        FETCH_ALL_DEPENDENTS_FAILED,
      );
      expect(dispatchSpy.firstCall.args[1]).to.equal(response);
    };
    thunk(dispatch);
  });
  afterEach(unMockFetch);
});
