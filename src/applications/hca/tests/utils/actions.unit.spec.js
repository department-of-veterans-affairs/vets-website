import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockApiRequest,
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import {
  getDismissedHCANotification,
  setDismissedHCANotification,
  getEnrollmentStatus,
  resetEnrollmentStatus,
} from '../../utils/actions';
import { ENROLLMENT_STATUS_ACTIONS } from '../../utils/constants';

describe('hca actions', () => {
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    RESET_ENROLLMENT_STATUS,
    FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
    FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
    FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
    SET_DISMISSED_HCA_NOTIFICATION,
  } = ENROLLMENT_STATUS_ACTIONS;
  let dispatch;

  describe('when `getEnrollmentStatus` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
    });

    describe('when fetch operation succeeds', () => {
      it('should dispatch a fetch succeeded action with data', () => {
        const mockData = { data: 'data' };
        const getState = () => ({
          hcaEnrollmentStatus: {
            isLoadingApplicationStatus: false,
          },
        });
        mockApiRequest(mockData);
        return getEnrollmentStatus()(dispatch, getState).then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            FETCH_ENROLLMENT_STATUS_STARTED,
          );
          expect(dispatch.secondCall.args[0]).to.eql({
            type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
            data: mockData,
          });
        });
      });
    });

    describe('when fetch operation fails', () => {
      it('should dispatch a fetch failed action', () => {
        const mockData = { data: 'data' };
        const getState = () => ({
          hcaEnrollmentStatus: {
            isLoadingApplicationStatus: false,
          },
        });
        mockApiRequest(mockData, false);
        return getEnrollmentStatus()(dispatch, getState).then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            FETCH_ENROLLMENT_STATUS_STARTED,
          );
          expect(dispatch.secondCall.args[0].type).to.equal(
            FETCH_ENROLLMENT_STATUS_FAILED,
          );
        });
      });
    });

    describe('when a call is already in flight', () => {
      it('should not dispatch anything', done => {
        const getState = () => ({
          hcaEnrollmentStatus: {
            isLoadingApplicationStatus: true,
          },
        });
        expect(getEnrollmentStatus()(dispatch, getState)).to.be.null;
        expect(dispatch.notCalled).to.be.true;
        done();
      });
    });

    describe('when form data is passed in', () => {
      it('should append the form data to the request URL', () => {
        mockFetch();
        setFetchJSONResponse(global.fetch.onFirstCall(), { status: 'OK' });
        const getState = () => ({
          hcaEnrollmentStatus: {
            isLoadingApplicationStatus: false,
          },
        });
        const formData = {
          dob: '01-01-00',
          firstName: 'Pat',
          lastName: 'Smith',
          ssn: '123-12-1234',
        };
        return getEnrollmentStatus(formData)(dispatch, getState).then(() => {
          expect(global.fetch.firstCall.args[0]).to.contain(
            'health_care_applications/enrollment_status',
          );
          expect(global.fetch.firstCall.args[0]).to.contain(
            'userAttributes%5BveteranDateOfBirth%5D=01-01-00',
          );
          expect(global.fetch.firstCall.args[0]).to.contain(
            'userAttributes%5BveteranFullName%5D%5Bfirst%5D=Pat',
          );
          expect(global.fetch.firstCall.args[0]).to.contain(
            'userAttributes%5BveteranFullName%5D%5Blast%5D=Smith',
          );
          expect(global.fetch.firstCall.args[0]).to.contain(
            'userAttributes%5BveteranSocialSecurityNumber%5D=123-12-1234',
          );
        });
      });
    });
  });

  describe('when `resetEnrollmentStatus` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
    });

    it('should dispatch a reset enrollment status action', () => {
      resetEnrollmentStatus()(dispatch);
      expect(dispatch.firstCall.args[0].type).to.equal(RESET_ENROLLMENT_STATUS);
    });
  });

  describe('when `getDismissedHCANotification` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
    });

    describe('when fetch operation succeeds', () => {
      it('should dispatch a fetch succeeded action with data', () => {
        const mockData = { data: 'data' };
        mockApiRequest(mockData);
        return getDismissedHCANotification()(dispatch).then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
          );
          expect(dispatch.secondCall.args[0]).to.eql({
            type: FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
            response: mockData,
          });
        });
      });
    });

    describe('when fetch operation fails', () => {
      it('should dispatch a fetch failed action', () => {
        const mockData = { data: 'data' };
        mockApiRequest(mockData, false);
        return getDismissedHCANotification()(dispatch).then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
          );
          expect(dispatch.secondCall.args[0].type).to.equal(
            FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
          );
        });
      });
    });
  });

  describe('when `setDismissedHCANotification` executes', () => {
    const statusEffectiveAtDate = 1565025055759;
    beforeEach(() => {
      mockFetch();
      setFetchJSONResponse(global.fetch.onFirstCall(), { status: 'OK' });
      dispatch = sinon.spy();
    });

    describe('when an HCA notification is being dismissed for the first time', () => {
      beforeEach(() => {
        setDismissedHCANotification('status', statusEffectiveAtDate)(
          dispatch,
          () => ({
            hcaEnrollmentStatus: {
              dismissedNotificationDate: null,
            },
          }),
        );
      });

      it('should dispatch a SET_DISMISSED_HCA_NOTIFICATION action with the effective date', () => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DISMISSED_HCA_NOTIFICATION,
          data: statusEffectiveAtDate,
        });
      });

      it('should call the correct POST endpoint', () => {
        expect(global.fetch.firstCall.args[0]).to.contain(
          '/v0/notifications/dismissed_statuses',
        );
        expect(global.fetch.firstCall.args[1].method).to.eql('POST');
      });
    });

    describe('when an HCA notification has previously been dismissed', () => {
      beforeEach(() => {
        setDismissedHCANotification('status', statusEffectiveAtDate)(
          dispatch,
          () => ({
            hcaEnrollmentStatus: {
              dismissedNotificationDate: 1565025055758,
            },
          }),
        );
      });

      it('should dispatch a SET_DISMISSED_HCA_NOTIFICATION action with the effective date', () => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DISMISSED_HCA_NOTIFICATION,
          data: statusEffectiveAtDate,
        });
      });

      it('should call the correct PUT endpoint if a notification is being dismissed for the second time', () => {
        expect(global.fetch.firstCall.args[0]).to.contain(
          '/notifications/dismissed_statuses/form_10_10ez',
        );
        expect(global.fetch.firstCall.args[1].method).to.eql('PUT');
      });
    });
  });
});
