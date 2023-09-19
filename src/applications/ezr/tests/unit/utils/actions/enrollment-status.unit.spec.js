import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import { fetchEnrollmentStatus } from '../../../../utils/actions/entrollment-status';
import { ENROLLMENT_STATUS_ACTIONS } from '../../../../utils/constants';

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

  describe('when `fetchEnrollmentStatus` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
      getState = () => ({
        enrollmentStatus: { loading: false },
      });
      mockData = { data: 'data' };
      thunk = fetchEnrollmentStatus();
    });

    describe('when fetch operation starts', () => {
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

    describe('when fetch operation succeeds', () => {
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

    describe('when fetch operation fails', () => {
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

    describe('when fetch operation is already in progress', () => {
      it('should not dispatch anything', done => {
        getState = () => ({
          enrollmentStatus: { loading: true },
        });
        expect(thunk(dispatch, getState)).to.be.null;
        expect(dispatch.notCalled).to.be.true;
        done();
      });
    });

    describe('when form data is provided to fetch operation', () => {
      it('should append the form data to the request URL', done => {
        mockData = {
          data: {
            dob: '01-01-00',
            firstName: 'Pat',
            lastName: 'Smith',
            ssn: '123-12-1234',
          },
        };
        thunk = fetchEnrollmentStatus(mockData.data);

        mockApiRequest(mockData);
        setFetchJSONResponse(global.fetch.onCall(0), { status: 'OK' });

        thunk(dispatch, getState)
          .then(() => {
            const fetch = global.fetch.firstCall.args[0];
            expect(fetch).to.contain(
              `${encodeURI('userAttributes[veteranDateOfBirth]')}=${
                mockData.data.dob
              }`,
            );
            expect(fetch).to.contain(
              `${encodeURI('userAttributes[veteranFullName][first]')}=${
                mockData.data.firstName
              }`,
            );
            expect(fetch).to.contain(
              `${encodeURI('userAttributes[veteranFullName][last]')}=${
                mockData.data.lastName
              }`,
            );
            expect(fetch).to.contain(
              `${encodeURI('userAttributes[veteranSocialSecurityNumber]')}=${
                mockData.data.ssn
              }`,
            );
          })
          .then(done, done);
      });
    });
  });
});
