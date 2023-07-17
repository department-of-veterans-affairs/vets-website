import { expect } from 'chai';
import sinon from 'sinon';
// import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  FETCH_ENROLLMENT_STATUS_FAILED,
  FETCH_ENROLLMENT_STATUS_STARTED,
  FETCH_ENROLLMENT_STATUS_SUCCEEDED,
  fetchEnrollmentStatusFailed,
  fetchEnrollmentStatusStarted,
  fetchEnrollmentStatusSucceeded,
  fetchEnrollmentStatus,
} from '.';

const enrollmentStatus = {
  effectiveDate: '2019-01-02T21:58:55.000-06:00',
  priorityGroup: 'Group 8G',
};

const mockApiSuccess = (path, data) => {
  const url = `${environment.API_URL}${path}`;
  const server = setupServer(
    rest.get(url, (_, res, ctx) => res(ctx.json(data))),
  );
  server.listen();
  return server;
};

const mockApiFailure = path => {
  const url = `${environment.API_URL}${path}`;
  const server = setupServer(
    rest.get(url, (_, res, ctx) =>
      res(ctx.status(404), ctx.json({ error: 'Not Found' })),
    ),
  );
  server.listen();
  return server;
};

const initialState = {
  data: {},
  error: false,
  loading: false,
};

describe('Enrollment Status actions', () => {
  describe('fetchEnrollmentStatusStarted', () => {
    it('returns FETCH_ENROLLMENT_STATUS_STARTED action', () => {
      const { type } = fetchEnrollmentStatusStarted();
      expect(type).to.equal(FETCH_ENROLLMENT_STATUS_STARTED);
    });
  });

  describe('fetchEnrollmentStatusSucceeded', () => {
    it('returns FETCH_ENROLLMENT_STATUS_SUCCEEDED action with data', () => {
      const { data, type } = fetchEnrollmentStatusSucceeded(enrollmentStatus);
      expect(data).to.equal(enrollmentStatus);
      expect(type).to.equal(FETCH_ENROLLMENT_STATUS_SUCCEEDED);
    });
  });

  describe('fetchEnrollmentStatusFailed', () => {
    it('returns FETCH_ENROLLMENT_STATUS_FAILED action', () => {
      const { type } = fetchEnrollmentStatusFailed();
      expect(type).to.equal(FETCH_ENROLLMENT_STATUS_FAILED);
    });
  });

  describe('fetchEnrollmentStatus', () => {
    it('gets the enrollment status', done => {
      const path = '/v0/health_care_applications/enrollment_status';
      const server = mockApiSuccess(path, enrollmentStatus);
      const dispatch = sinon.spy();
      const thunk = fetchEnrollmentStatus();
      thunk(dispatch, initialState)
        .then(() => {
          expect(dispatch.calledWith(fetchEnrollmentStatusStarted)).to.be.true;
        })
        .catch(err => done(err))
        .finally(() => {
          server.close();
          done();
        });
    });

    it('dispatches a failure', done => {
      const path = '/v0/health_care_applications/enrollment_status';
      const server = mockApiFailure(path);
      const dispatch = sinon.spy();
      const thunk = fetchEnrollmentStatus();
      thunk(dispatch, initialState)
        .then(() => {
          expect(dispatch.calledWith(fetchEnrollmentStatusFailed)).to.be.true;
        })
        .catch(err => {
          done(err);
        })
        .finally(() => {
          server.close();
          done();
        });
    });
  });
});
