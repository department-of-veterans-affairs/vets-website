import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import {
  fetchEnrollmentStatus,
  resetEnrollmentStatus,
} from '../../../../utils/actions';
import {
  MOCK_ENROLLMENT_RESPONSE,
  ENROLLMENT_STATUS_ACTIONS,
} from '../../../../utils/constants';

describe('hca enrollment status actions', () => {
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    RESET_ENROLLMENT_STATUS,
  } = ENROLLMENT_STATUS_ACTIONS;
  let dispatch;
  let getState;
  let mockData;
  let thunk;

  context('when `fetchEnrollmentStatus` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
      getState = () => ({
        hcaEnrollmentStatus: { loading: false },
      });
      mockData = { data: 'data' };
    });

    context('when we are not simulating the local server', () => {
      beforeEach(() => {
        thunk = fetchEnrollmentStatus();
      });

      context('when fetch operation starts', done => {
        it('should dispatch a fetch started action', () => {
          mockApiRequest(mockData);
          thunk(dispatch, getState)
            .then(() => {
              const { type } = dispatch.firstCall.args[0];
              expect(type).to.eq(FETCH_ENROLLMENT_STATUS_STARTED);
            })
            .then(done, done);
        });
      });

      context('when fetch operation succeeds', done => {
        it('should dispatch a fetch succeeded action with data', () => {
          mockApiRequest(mockData);
          thunk(dispatch, getState)
            .then(() => {
              const { type, response } = dispatch.secondCall.args[0];
              expect(type).to.eq(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
              expect(response).to.eq(mockData);
            })
            .then(done, done);
        });
      });

      context('when fetch operation fails', done => {
        it('should dispatch a fetch failed action', () => {
          mockApiRequest(mockData, false);
          setFetchJSONResponse(
            global.fetch.onCall(0),
            // eslint-disable-next-line prefer-promise-reject-errors
            Promise.reject({ status: 503, error: 'error' }),
          );
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
            hcaEnrollmentStatus: { loading: true },
          });
          expect(thunk(dispatch, getState)).to.be.null;
          expect(dispatch.notCalled).to.be.true;
          done();
        });
      });
    });

    context('when we are simulating the local server', () => {
      const getThunk = ({ firstName }) =>
        fetchEnrollmentStatus(
          { firstName, lastName: 'Smith', dob: '1990-01-01', ssn: '211111111' },
          { isLocalhost: () => true },
          true,
        );

      context('when fetch operation succeeds', done => {
        it('should dispatch a mock succeeded action with data', () => {
          thunk = getThunk({ firstName: 'Dan' });
          thunk(dispatch, getState)
            .then(() => {
              const { type, response } = dispatch.secondCall.args[0];
              expect(type).to.eq(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
              expect(JSON.stringify(response)).to.eq(
                JSON.stringify(MOCK_ENROLLMENT_RESPONSE),
              );
            })
            .then(done, done);
        });
      });

      context('when fetch operation fails', done => {
        it('should dispatch a mock failed action', () => {
          thunk = getThunk({ firstName: 'Patrick' });
          thunk(dispatch, getState)
            .then(() => {
              const { type } = dispatch.secondCall.args[0];
              expect(type).to.eq(FETCH_ENROLLMENT_STATUS_FAILED);
            })
            .then(done, done);
        });
      });
    });
  });

  context('when `resetEnrollmentStatus` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
    });

    it('should dispatch a reset enrollment status action', () => {
      resetEnrollmentStatus()(dispatch);
      const { type } = dispatch.firstCall.args[0];
      expect(type).to.eq(RESET_ENROLLMENT_STATUS);
    });
  });
});
