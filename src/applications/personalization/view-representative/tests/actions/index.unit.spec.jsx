import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import {
  FETCH_REPRESENTATIVE_FAILED,
  FETCH_REPRESENTATIVE_SUCCESS,
  fetchRepresentative,
} from '../../actions';

import { currentRepresentative } from '../helpers';

describe('View Representative', () => {
  beforeEach(() => mockFetch());

  it('should get current Reppresentative', () => {
    setFetchJSONResponse(global.fetch.onCall(0), currentRepresentative);
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
    setFetchJSONResponse(global.fetch.onCall(0), response);
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
});
