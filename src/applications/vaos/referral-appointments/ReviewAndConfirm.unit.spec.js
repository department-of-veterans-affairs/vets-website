import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReviewAndConfirm from './ReviewAndConfirm';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createReferral, getReferralSlotKey } from './utils/referrals';
import { FETCH_STATUS } from '../utils/constants';
import { createProviderDetails } from './utils/provider';
import * as getProviderByIdModule from '../services/referral';

describe('VAOS Component: ReviewAndConfirm', () => {
  const sandbox = sinon.createSandbox();
  const providerDetails = createProviderDetails(1);
  providerDetails.slots[0].start = '2024-09-09T16:00:00.000Z';
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedProvider: providerDetails,
      providerFetchStatus: FETCH_STATUS.succeeded,
      selectedSlot: '0',
      currentPage: 'reviewAndConfirm',
    },
  };
  const initialEmptyState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedProvider: {},
      providerFetchStatus: FETCH_STATUS.notStarted,
    },
  };
  const failedState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedProvider: {},
      providerFetchStatus: FETCH_STATUS.failed,
    },
  };
  beforeEach(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    sandbox
      .stub(getProviderByIdModule, 'getProviderById')
      .resolves(providerDetails);
  });
  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
  });
  it('should not fetch provider if in redux', async () => {
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferral('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );
    expect(await screen.getByTestId('review-your-appointment-details-heading'))
      .to.exist;
    sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
  });
  it('should fetch provider if not in redux', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.setItem(selectedSlotKey, '0');
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferral('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialEmptyState),
      },
    );
    expect(await screen.getByTestId('loading')).to.exist;
    sandbox.assert.calledOnce(getProviderByIdModule.getProviderById);
  });
  it('should show the error message if fetch fails', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.setItem(selectedSlotKey, '0');

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferral('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(failedState),
      },
    );
    expect(await screen.getByTestId('error')).to.exist;
  });
  it('should get selected slot from session storage if not in redux', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.setItem(selectedSlotKey, '0');
    const noSelectState = {
      ...initialFullState,
      ...{ referral: { ...initialFullState.referral, selectedSlot: '' } },
    };
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferral('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(noSelectState),
      },
    );
    expect(await screen.getByTestId('review-your-appointment-details-heading'))
      .to.exist;
    expect(await screen.getByTestId('slot-day-time')).to.contain.text(
      'Monday, September 9, 2024',
    );
    expect(await screen.getByTestId('slot-day-time')).to.contain.text(
      '12:00 p.m. Eastern time (ET)',
    );
    sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
  });
  it('should route to scheduleReferral if no slot selected', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.removeItem(selectedSlotKey);
    const noSelectState = {
      ...initialFullState,
      ...{ referral: { ...initialFullState.referral, selectedSlot: '' } },
    };
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferral('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(noSelectState),
        path: '/schedule-referral/date-time',
      },
    );
    sandbox.assert.notCalled(getProviderByIdModule.getProviderById);
    expect(screen.history.push.calledWith('/schedule-referral?id=UUID')).to.be
      .true;
  });
});
