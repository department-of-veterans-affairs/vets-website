import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { fetchEnrollmentStatus } from '../../../../utils/actions/enrollment-status';
import {
  ENROLLMENT_STATUS_ACTIONS,
  MOCK_ENROLLMENT_RESPONSE,
} from '../../../../utils/constants';

describe('ezr enrollment status actions', () => {
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
  } = ENROLLMENT_STATUS_ACTIONS;
  let dispatch;
  let getState;
  let mockData;
  let thunk;
  let apiRequestStub;

  beforeEach(() => {
    dispatch = sinon.spy();
    apiRequestStub = sinon.stub(api, 'apiRequest');
    getState = () => ({
      enrollmentStatus: { loading: false },
    });
    mockData = { data: 'data' };
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  context('when environment is not localhost', () => {
    beforeEach(() => {
      thunk = fetchEnrollmentStatus();
    });

    context('when fetch operation starts', () => {
      it('should dispatch a fetch started action', done => {
        apiRequestStub.onFirstCall().resolves(mockData);
        thunk(dispatch, getState)
          .then(() => {
            const { type } = dispatch.firstCall.args[0];
            expect(type).to.eq(FETCH_ENROLLMENT_STATUS_STARTED);
          })
          .then(done, done);
      });
    });

    context('when fetch operation succeeds', () => {
      it('should dispatch a fetch succeeded action with data', done => {
        apiRequestStub.onFirstCall().resolves(mockData);
        thunk(dispatch, getState)
          .then(() => {
            const { type, response } = dispatch.secondCall.args[0];
            expect(type).to.eq(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
            expect(response).to.eq(mockData);
          })
          .then(done, done);
      });
    });

    context('when fetch operation fails', () => {
      it('should dispatch a fetch failed action', done => {
        apiRequestStub.onFirstCall().rejects({ status: 503, error: 'error' });
        thunk(dispatch, getState)
          .then(() => {
            const { type } = dispatch.secondCall.args[0];
            expect(type).to.eq(FETCH_ENROLLMENT_STATUS_FAILED);
          })
          .then(done, done);
      });
    });

    context('when fetch operation is already in progress', () => {
      it('should not dispatch anything', done => {
        getState = () => ({
          enrollmentStatus: { loading: true },
        });
        expect(thunk(dispatch, getState)).to.be.null;
        expect(dispatch.notCalled).to.be.true;
        done();
      });
    });
  });

  context('when environment is localhost', () => {
    beforeEach(() => {
      thunk = fetchEnrollmentStatus({ isLocalhost: () => true }, true);
    });

    context('when fetch operation succeeds', () => {
      it('should dispatch a fetch succeeded action with data', done => {
        thunk(dispatch, getState)
          .then(() => {
            const action = dispatch.secondCall.args[0];
            expect(action.type).to.equal(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
            expect(action.response).to.equal(MOCK_ENROLLMENT_RESPONSE);
          })
          .then(done, done);
      });
    });
  });
});
