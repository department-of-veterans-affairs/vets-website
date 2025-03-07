import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as getPatientReferralsModule from '../../../../services/referral';
import * as getAppointmentsModule from '../../../../services/vaos';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';
import { FETCH_STATUS } from '../../../../utils/constants';

import TestComponent from './TestComponent';

describe('Community Care Referrals', () => {
  describe('useGetReferralsAndRequests hook', () => {
    const possibleFetchStatuses = [
      {
        referralsFetchStatus: FETCH_STATUS.failed,
        pendingStatus: FETCH_STATUS.failed,
      },
      {
        referralsFetchStatus: FETCH_STATUS.failed,
        pendingStatus: FETCH_STATUS.succeeded,
      },
      {
        referralsFetchStatus: FETCH_STATUS.succeeded,
        pendingStatus: FETCH_STATUS.failed,
      },
      {
        referralsFetchStatus: FETCH_STATUS.succeeded,
        pendingStatus: FETCH_STATUS.succeeded,
      },
    ];
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    });
    afterEach(() => {
      sandbox.restore();
    });
    possibleFetchStatuses.forEach(({ referralsFetchStatus, pendingStatus }) => {
      it('sets loading to false if either fetch is complete', () => {
        sandbox
          .stub(getPatientReferralsModule, 'getPatientReferrals')
          .resolves([]);
        sandbox
          .stub(getAppointmentsModule, 'getAppointments')
          .resolves({ data: [] });
        const initialState = {
          featureToggles: {
            vaOnlineSchedulingCCDirectScheduling: true,
          },
          referral: {
            referrals: [],
            referralsFetchStatus,
          },
          appointments: {
            pending: [],
            pendingStatus,
          },
        };
        const screen = renderWithStoreAndRouter(<TestComponent />, {
          initialState,
        });
        expect(screen.getByText(/Test component/i)).to.exist;
        expect(screen.getByText(/Loading: false/i)).to.exist;
      });
    });
    it('fetches referrals and requests when status is not started', () => {
      sandbox
        .stub(getPatientReferralsModule, 'getPatientReferrals')
        .resolves([]);
      sandbox
        .stub(getAppointmentsModule, 'getAppointments')
        .resolves({ data: [] });
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        referral: {
          referrals: [],
          referralsFetchStatus: FETCH_STATUS.notStarted,
        },
        appointments: {
          pending: [],
          pendingStatus: FETCH_STATUS.notStarted,
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByText(/Test component/i)).to.exist;
      sandbox.assert.calledOnce(getPatientReferralsModule.getPatientReferrals);
      sandbox.assert.calledOnce(getAppointmentsModule.getAppointments);
    });
    it('sets errors to true for both fetches when status is failed', () => {
      sandbox
        .stub(getPatientReferralsModule, 'getPatientReferrals')
        .resolves([]);
      sandbox
        .stub(getAppointmentsModule, 'getAppointments')
        .resolves({ data: [] });
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        referral: {
          referrals: [],
          referralsFetchStatus: FETCH_STATUS.failed,
        },
        appointments: {
          pending: [],
          pendingStatus: FETCH_STATUS.failed,
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByText(/Test component/i)).to.exist;
      expect(screen.getByText(/Referrals error: true/i)).to.exist;
      expect(screen.getByText(/Requests error: true/i)).to.exist;
    });
    it('shows the button if the feature toggle is on', () => {
      sandbox
        .stub(getPatientReferralsModule, 'getPatientReferrals')
        .resolves([]);
      sandbox
        .stub(getAppointmentsModule, 'getAppointments')
        .resolves({ data: [] });
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
          vaOnlineSchedulingRequests: true,
        },
        referral: {
          referrals: [],
          referralsFetchStatus: FETCH_STATUS.succeeded,
        },
        appointments: {
          pending: [],
          pendingStatus: FETCH_STATUS.succeeded,
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByText(/Test component/i)).to.exist;
      expect(screen.getByText(/Button/i)).to.exist;
    });
  });
});
