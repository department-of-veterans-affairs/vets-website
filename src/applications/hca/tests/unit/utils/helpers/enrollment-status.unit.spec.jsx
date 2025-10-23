import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import {
  callAPI,
  callFake404,
  callFakeSuccess,
} from '../../../../utils/helpers';

describe('hca enrollment status helpers', () => {
  let apiRequestStub;
  let dispatch;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    dispatch = sinon.spy();
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  context('when `callAPI` executes', done => {
    it('should execute the dispatch function', () => {
      apiRequestStub.onFirstCall().resolves({ data: 'data' });
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
