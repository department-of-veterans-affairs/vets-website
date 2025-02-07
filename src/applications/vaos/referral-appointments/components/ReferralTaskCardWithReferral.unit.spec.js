import React from 'react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { waitFor } from '@testing-library/dom';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';
import ReferralTaskCardWithReferral from './ReferralTaskCardWithReferral';

import { createReferralById } from '../utils/referrals';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCCDirectScheduling: true,
  },
  referral: {
    facility: null,
    referralDetails: [
      createReferralById('2024-11-29', 'add2f0f4-a1ea-4dea-a504-a54ab57c6801'),
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
  it('should display the expired alert when referral is expired', async () => {
    const store = createTestStore({
      ...initialState,
      referral: {
        ...initialState.referral,
        referralDetails: [
          createReferralById(
            '2024-11-29',
            '445e2d1b-7150-4631-97f2-f6f473bdef00',
            '111',
            '2024-12-01',
          ),
        ],
      },
    });
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });
    expect(await screen.getByTestId('expired-alert')).to.exist;
  });

  it('should display the error alert when fetch fails', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=error',
    });
    await waitFor(() => {
      expect(screen.getByTestId('referral-error')).to.exist;
    });
  });
});
