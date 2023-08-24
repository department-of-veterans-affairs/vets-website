import { expect } from 'chai';
import sinon from 'sinon';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from '~/platform/utilities/environment';
import {
  FETCH_HCA_ENROLLMENT_STATUS_FAILED,
  FETCH_HCA_ENROLLMENT_STATUS_STARTED,
  FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED,
  fetchHcaEnrollmentStatus,
  fetchHcaEnrollmentStatusFailed,
  fetchHcaEnrollmentStatusStarted,
  fetchHcaEnrollmentStatusSucceeded,
} from '../../actions/hca-es';
import { initialState } from '../../reducers/hca-es';

const enrollmentStatus = {
  effectiveDate: '2019-01-02T21:58:55.000-06:00',
  priorityGroup: 'Group 8G',
};

const mockApi = (path, data, status = 200) => {
  const url = `${environment.API_URL}${path}`;
  const server = setupServer(
    rest.get(url, (_, res, ctx) => res(ctx.status(status), ctx.json(data))),
  );
  server.listen();
  return server;
};

describe('HCA Enrollment Status actions', () => {
  describe('fetchHcaEnrollmentStatusStarted', () => {
    it('returns FETCH_HCA_ENROLLMENT_STATUS_STARTED action', () => {
      const { type } = fetchHcaEnrollmentStatusStarted();
      expect(type).to.equal(FETCH_HCA_ENROLLMENT_STATUS_STARTED);
    });
  });

  describe('fetchHcaEnrollmentStatusFailed', () => {
    it('returns FETCH_HCA_ENROLLMENT_STATUS_FAILED action', () => {
      const message = { errorMessage: 'it broke' };
      const { type, payload } = fetchHcaEnrollmentStatusFailed(message);
      expect(type).to.equal(FETCH_HCA_ENROLLMENT_STATUS_FAILED);
      expect(payload).to.equal(message);
    });
  });

  describe('fetchHcaEnrollmentStatusSucceeded', () => {
    it('returns FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED action with data', () => {
      const { type, payload } = fetchHcaEnrollmentStatusSucceeded(
        enrollmentStatus,
      );
      expect(payload).to.equal(enrollmentStatus);
      expect(type).to.equal(FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED);
    });
  });

  describe('fetchHcaEnrollmentStatus', () => {
    it('gets the enrollment status', done => {
      const path = '/v0/health_care_applications/enrollment_status';
      const server = mockApi(path, enrollmentStatus);
      const dispatch = sinon.spy();
      const thunk = fetchHcaEnrollmentStatus();
      thunk(dispatch, initialState)
        .then(() => {
          expect(dispatch.calledWith(fetchHcaEnrollmentStatusStarted)).to.be
            .true;
        })
        .finally(() => {
          server.close();
          done();
        });
    });

    it('dispatches an error when resource is not found', done => {
      const path = '/v0/health_care_applications/enrollment_status';
      const server = mockApi(path, { errorMessage: 'Not Found' }, 404);
      const dispatch = sinon.spy();
      const thunk = fetchHcaEnrollmentStatus();
      thunk(dispatch, initialState)
        .then(() => {
          expect(dispatch.calledWith(fetchHcaEnrollmentStatusFailed)).to.be
            .true;
        })
        .finally(() => {
          server.close();
          done();
        });
    });

    it('dispatches an error when the server experiences an error', done => {
      const path = '/v0/health_care_applications/enrollment_status';
      const server = mockApi(path, { errorMessage: 'Server Error' }, 500);
      const dispatch = sinon.spy();
      const thunk = fetchHcaEnrollmentStatus();
      thunk(dispatch, initialState)
        .then(() => {
          expect(dispatch.calledWith(fetchHcaEnrollmentStatusFailed)).to.be
            .true;
        })
        .finally(() => {
          server.close();
          done();
        });
    });
  });
});
