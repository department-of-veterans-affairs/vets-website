import React from 'react';
import { expect } from 'chai';
import MockDate from 'mockdate';

import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';
import ReferralTaskCardWithReferral from './ReferralTaskCardWithReferral';

import { createReferral } from '../utils/referrals';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCCDirectScheduling: true,
  },
  referral: {
    facility: null,
    referrals: [
      createReferral('2024-11-29', 'add2f0f4-a1ea-4dea-a504-a54ab57c6801'),
    ],
    referralFetchStatus: FETCH_STATUS.succeeded,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983' }],
    },
  },
};

describe('VAOS Component: ReferralTaskCardWithReferral', () => {
  beforeEach(() => {
    // Set the current date to after the referral date but before the expiration date
    MockDate.set('2025-01-01');
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should display the task card when an ID is found', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    });

    expect(await screen.findByTestId('referral-task-card')).to.exist;
  });

  it('should not display the task card when feature toggle is off', async () => {
    const modifiedState = {
      ...initialState,
      featureToggles: {
        vaOnlineSchedulingCCDirectScheduling: false,
      },
    };
    const store = createTestStore(modifiedState);
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=add2f0f4-a1ea-a504-a54ab57c6801',
    });

    const taskCard = screen.queryByTestId('referral-task-card');
    expect(taskCard).to.be.null;
  });

  it('should not display the task card when referral ID is not found', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=non-existent-id',
    });

    const taskCard = screen.queryByTestId('referral-task-card');
    expect(taskCard).to.be.null;
  });

  it('should not display the task card when no ID is provided in the URL', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/',
    });

    const taskCard = screen.queryByTestId('referral-task-card');
    expect(taskCard).to.be.null;
  });
});
