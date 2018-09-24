import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, resetFetch } from '../../../../../platform/testing/unit/helpers.js';
import {
  verifyDisabilityRating
} from '../../../686/actions/index';

function setFetchResponse(stub, data) {
  const response = new Response(null, { headers: { 'content-type': ['application/json'] } });
  response.ok = true;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

function setFetchFailure(stub, data) {
  const response = new Response(null, { headers: { 'content-type': ['application/json'] } });
  response.ok = false;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('authorization actions', () => {
  describe('verifyDisablityRating', () => {
    it('should dispatch LOAD_DISABILITY_RATING_STARTED and LOAD_DISABLITY_RATING_SUCCEEDED actions', (done) => {
      const payload = { test: 'test' };
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), payload);

      const dispatch = sinon.spy();

      verifyDisabilityRating()(dispatch);

      expect(dispatch.firstCall.calledWith({
        type: 'LOAD_DISABILITY_RATING_STARTED'
      })).to.be.true;

      setTimeout(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: 'LOAD_DISABILITY_RATING_SUCCEEDED',
          payload
        });
        resetFetch();
        done();
      }, 0);
    });

    it('should dispatch LOAD_DISABILITY_RATING_STARTED and LOAD_DISABILITY_RATING_FAILED actions', (done) => {
      const error = { test: 'test' };
      mockFetch();
      setFetchFailure(global.fetch.onFirstCall(), error);

      const dispatch = sinon.spy();

      verifyDisabilityRating()(dispatch);

      expect(dispatch.firstCall.calledWith({
        type: 'LOAD_DISABILITY_RATING_STARTED'
      })).to.be.true;

      setTimeout(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: 'LOAD_DISABILITY_RATING_FAILED',
          error
        });
        resetFetch();
        done();
      }, 0);
    });
  });
});
