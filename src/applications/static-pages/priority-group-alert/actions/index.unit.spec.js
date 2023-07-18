import { expect } from 'chai';
import sinon from 'sinon';
// import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import * as Sentry from '@sentry/browser';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  FETCH_ENROLLMENT_STATUS_BEGIN,
  FETCH_ENROLLMENT_STATUS_ERROR,
  FETCH_ENROLLMENT_STATUS_SUCCESS,
  fetchEnrollmentStatusBegin,
  fetchEnrollmentStatusError,
  fetchEnrollmentStatusSuccess,
  fetchEnrollmentStatus,
} from '.';
import { initialState } from '../reducers';

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
      res(ctx.status(404), ctx.json({ errorMessage: 'Not Found' })),
    ),
  );
  server.listen();
  return server;
};

describe('Enrollment Status actions', () => {
  describe('fetchEnrollmentStatusBegin', () => {
    it('returns FETCH_ENROLLMENT_STATUS_BEGIN action', () => {
      const { type } = fetchEnrollmentStatusBegin();
      expect(type).to.equal(FETCH_ENROLLMENT_STATUS_BEGIN);
    });
  });

  describe('fetchEnrollmentStatusError', () => {
    it('returns FETCH_ENROLLMENT_STATUS_ERROR action', () => {
      const message = { errorMessage: 'it broke' };
      const { type, payload } = fetchEnrollmentStatusError(message);
      expect(type).to.equal(FETCH_ENROLLMENT_STATUS_ERROR);
      expect(payload).to.equal(message);
    });
  });

  describe('fetchEnrollmentStatusSuccess', () => {
    it('returns FETCH_ENROLLMENT_STATUS_SUCCESS action with data', () => {
      const { type, payload } = fetchEnrollmentStatusSuccess(enrollmentStatus);
      expect(payload).to.equal(enrollmentStatus);
      expect(type).to.equal(FETCH_ENROLLMENT_STATUS_SUCCESS);
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
          expect(dispatch.calledWith(fetchEnrollmentStatusBegin)).to.be.true;
        })
        .finally(() => {
          server.close();
          done();
        });
    });

    it('dispatches an error', done => {
      const path = '/v0/health_care_applications/enrollment_status';
      const server = mockApiFailure(path);
      const dispatch = sinon.spy();
      const sentry = sinon.spy(Sentry, 'captureException');
      const thunk = fetchEnrollmentStatus();
      thunk(dispatch, initialState)
        .then(() => {
          expect(dispatch.calledWith(fetchEnrollmentStatusError)).to.be.true;
          expect(sentry.called).to.be.true;
          expect(sentry.firstCall.args[0]).to.eq({ errorMessage: 'Not Found' });
        })
        .finally(() => {
          server.close();
          done();
        });
    });
  });
});
