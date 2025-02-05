import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as getPatientReferralByIdModule from '../../../../services/referral';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';
import { createReferralById } from '../../../utils/referrals';
import { FETCH_STATUS } from '../../../../utils/constants';

import TestComponent from './TestComponent';

describe('Community Care Referrals', () => {
  describe('useGetReferralById hook', () => {
    const now = '2024-11-20';
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('Loads test component with hook and fetches referral when state is empty', () => {
      sandbox
        .stub(getPatientReferralByIdModule, 'getPatientReferralById')
        .resolves(createReferralById(now, '111'));
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        referral: {
          facility: null,
          referralDetails: [],
          referralFetchStatus: FETCH_STATUS.notStarted,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '983' }],
          },
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByText(/Test component/i)).to.exist;
      sandbox.assert.calledOnce(
        getPatientReferralByIdModule.getPatientReferralById,
      );
    });
    it('Returns the referral from store if exists without calling endpoint', () => {
      sandbox
        .stub(getPatientReferralByIdModule, 'getPatientReferralById')
        .resolves(createReferralById(now, '111'));
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        referral: {
          facility: null,
          referralDetails: [
            createReferralById(now, 'add2f0f4-a1ea-4dea-a504-a54ab57c6800'),
          ],
          referralFetchStatus: FETCH_STATUS.notStarted,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '983' }],
          },
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByText('add2f0f4-a1ea-4dea-a504-a54ab57c6800')).to.exist;
      sandbox.assert.notCalled(
        getPatientReferralByIdModule.getPatientReferralById,
      );
    });
  });
});
