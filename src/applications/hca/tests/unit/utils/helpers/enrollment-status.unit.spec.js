import { expect } from 'chai';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import sinon from 'sinon';

import {
  callAPI,
  callFake404,
  callFakeSuccess,
} from '../../../../utils/helpers/enrollment-status';

describe('hca enrollment status helpers', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
  });

  context('when `callAPI` executes', done => {
    it('should execute the dispatch function', () => {
      mockApiRequest({ data: 'data' });
      callAPI(dispatch)
        .then(() => {
          expect(dispatch).to.be.called;
        })
        .then(done, done);
    });
  });

  context('when `callFakeSuccess` executes', done => {
    it('should execute the dispatch function', () => {
      callFakeSuccess(dispatch)
        .then(() => {
          expect(dispatch).to.be.called;
        })
        .then(done, done);
    });
  });

  context('when `callFake404` executes', done => {
    it('should execute the dispatch function', () => {
      callFake404(dispatch)
        .then(() => {
          expect(dispatch).to.be.called;
        })
        .then(done, done);
    });
  });
});
