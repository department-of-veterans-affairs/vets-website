import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { dependents } from './helpers';

import {
  FETCH_ALL_DEPENDENTS_STARTED,
  FETCH_ALL_DEPENDENTS_SUCCESS,
  FETCH_ALL_DEPENDENTS_FAILED,
  fetchAllDependents,
} from '../../actions';

describe('View Disabilities actions: fetchAllDependents', () => {
  beforeEach(() => mockFetch());

  it('should dispatch STARTED action before fetching', async () => {
    setFetchJSONResponse(global.fetch.onCall(0), dependents);
    const thunk = fetchAllDependents();

    const dispatchSpy = sinon.spy();
    await thunk(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0].type).to.equal(
      FETCH_ALL_DEPENDENTS_STARTED,
    );
  });

  it('should fetch rated disabilities', () => {
    setFetchJSONResponse(global.fetch.onCall(0), dependents);
    const makeTheFetch = fetchAllDependents();

    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        FETCH_ALL_DEPENDENTS_STARTED,
      );
      expect(dispatchSpy.secondCall.args[0].type).to.equal(
        FETCH_ALL_DEPENDENTS_SUCCESS,
      );
      expect(dispatchSpy.secondCall.args[1].errors).to.equal(undefined);
    };
    makeTheFetch(dispatch);
  });

  it('should handle an error returned', async () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'some status',
        },
      ],
    };
    setFetchJSONResponse(global.fetch.onCall(0), response);
    const thunk = fetchAllDependents();
    const dispatchSpy = sinon.spy();
    await thunk(dispatchSpy);

    expect(dispatchSpy.calledTwice).to.be.true;
    expect(dispatchSpy.firstCall.args[0].type).to.equal(
      FETCH_ALL_DEPENDENTS_STARTED,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.equal(
      FETCH_ALL_DEPENDENTS_FAILED,
    );
  });
});
