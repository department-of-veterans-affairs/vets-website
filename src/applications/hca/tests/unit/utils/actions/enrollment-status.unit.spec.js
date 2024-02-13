import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import {
  getEnrollmentStatus,
  showReapplyContent,
} from '../../../../utils/actions/enrollment-status';
import {
  MOCK_ENROLLMENT_RESPONSE,
  ENROLLMENT_STATUS_ACTIONS,
} from '../../../../utils/constants';

describe('hca enrollment status actions', () => {
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    SHOW_REAPPLY_CONTENT,
  } = ENROLLMENT_STATUS_ACTIONS;
  let dispatch;
  let getState;
  let mockData;
  let thunk;

  context('when `getEnrollmentStatus` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
      getState = () => ({
        hcaEnrollmentStatus: { isLoadingApplicationStatus: false },
      });
      mockData = { data: 'data' };
    });

    context('when we are not simulating the local server', () => {
      beforeEach(() => {
        thunk = getEnrollmentStatus();
      });

      context('when fetch operation starts', () => {
        it('should dispatch a fetch started action', done => {
          mockApiRequest(mockData);
          thunk(dispatch, getState)
            .then(() => {
              const action = dispatch.firstCall.args[0];
              expect(action.type).to.equal(FETCH_ENROLLMENT_STATUS_STARTED);
            })
            .then(done, done);
        });
      });

      context('when fetch operation succeeds', () => {
        it('should dispatch a fetch succeeded action with data', done => {
          mockApiRequest(mockData);
          thunk(dispatch, getState)
            .then(() => {
              const action = dispatch.secondCall.args[0];
              expect(action.type).to.equal(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
              expect(action.response).to.equal(mockData);
            })
            .then(done, done);
        });
      });

      context('when fetch operation fails', () => {
        it('should dispatch a fetch failed action', done => {
          mockApiRequest(mockData, false);
          setFetchJSONResponse(
            global.fetch.onCall(0),
            // eslint-disable-next-line prefer-promise-reject-errors
            Promise.reject({ status: 503, error: 'error' }),
          );
          thunk(dispatch, getState)
            .then(() => {
              const action = dispatch.secondCall.args[0];
              expect(action.type).to.equal(FETCH_ENROLLMENT_STATUS_FAILED);
            })
            .then(done, done);
        });
      });

      context('when fetch operation is already in progress', () => {
        it('should not dispatch anything', done => {
          getState = () => ({
            hcaEnrollmentStatus: { isLoadingApplicationStatus: true },
          });
          expect(thunk(dispatch, getState)).to.be.null;
          expect(dispatch.notCalled).to.be.true;
          done();
        });
      });
    });

    context('when we are simulating the local server', () => {
      const getThunk = ({ firstName }) =>
        getEnrollmentStatus(
          { firstName, lastName: 'Smith', dob: '1990-01-01', ssn: '211111111' },
          { isLocalhost: () => true },
          true,
        );

      context('when fetch operation succeeds', () => {
        it('should dispatch a mock succeeded action with data', done => {
          thunk = getThunk({ firstName: 'Dan' });
          thunk(dispatch, getState)
            .then(() => {
              const action = dispatch.secondCall.args[0];
              expect(action.type).to.equal(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
              expect(JSON.stringify(action.response)).to.equal(
                JSON.stringify(MOCK_ENROLLMENT_RESPONSE),
              );
            })
            .then(done, done);
        });
      });

      context('when fetch operation fails', () => {
        it('should dispatch a mock failed action', done => {
          thunk = getThunk({ firstName: 'Patrick' });
          thunk(dispatch, getState)
            .then(() => {
              const action = dispatch.secondCall.args[0];
              expect(action.type).to.equal(FETCH_ENROLLMENT_STATUS_FAILED);
            })
            .then(done, done);
        });
      });
    });
  });

  context('when `showReapplyContent` executes', () => {
    it('should return the reapply action', () => {
      const result = showReapplyContent();
      expect(result.type).to.equal(SHOW_REAPPLY_CONTENT);
    });
  });
});
