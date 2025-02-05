import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

import ReviewAndConfirm from './ReviewAndConfirm';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createReferralAppointment } from './utils/appointment';
import { createReferralById, getReferralSlotKey } from './utils/referrals';
import { FETCH_STATUS } from '../utils/constants';
import { createDraftAppointmentInfo } from './utils/provider';
import * as postDraftReferralAppointmentModule from '../services/referral';
import * as flow from './flow';

describe('VAOS Component: ReviewAndConfirm', () => {
  const sandbox = sinon.createSandbox();
  const draftAppointmentInfo = createDraftAppointmentInfo(1);
  draftAppointmentInfo.slots.slots[0].start = '2024-09-09T16:00:00.000Z';
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      draftAppointmentInfo,
      draftAppointmentCreateStatus: FETCH_STATUS.succeeded,
      selectedSlot: '0',
      currentPage: 'reviewAndConfirm',
      appointmentCreateStatus: FETCH_STATUS.notStarted,
      postAppointmentStartTime: null,
    },
  };
  const initialEmptyState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      draftAppointmentInfo: {},
      draftAppointmentCreateStatus: FETCH_STATUS.notStarted,
      appointmentCreateStatus: FETCH_STATUS.notStarted,
      postAppointmentStartTime: null,
    },
  };
  beforeEach(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    sandbox
      .stub(postDraftReferralAppointmentModule, 'postDraftReferralAppointment')
      .resolves(draftAppointmentInfo);
  });
  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
  });
  it('should not fetch provider if in redux', async () => {
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );
    expect(await screen.getByTestId('referral-layout-heading')).to.exist;
    sandbox.assert.notCalled(
      postDraftReferralAppointmentModule.postDraftReferralAppointment,
    );
  });
  it('should fetch provider if not in redux', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.setItem(
      selectedSlotKey,
      '5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov0',
    );
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialEmptyState),
      },
    );
    expect(await screen.getByTestId('loading')).to.exist;
    sandbox.assert.calledOnce(
      postDraftReferralAppointmentModule.postDraftReferralAppointment,
    );
  });
  it('should get selected slot from session storage if not in redux', async () => {
    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.setItem(
      selectedSlotKey,
      '5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov0',
    );
    const noSelectState = {
      ...initialFullState,
      ...{ referral: { ...initialFullState.referral, selectedSlot: '' } },
    };
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(noSelectState),
      },
    );
    expect(await screen.getByTestId('referral-layout-heading')).to.exist;
    expect(await screen.getByTestId('slot-day-time')).to.contain.text(
      'Monday, September 9, 2024',
    );
    expect(await screen.getByTestId('slot-day-time')).to.contain.text(
      '12:00 p.m. Eastern time (ET)',
    );
    sandbox.assert.notCalled(
      postDraftReferralAppointmentModule.postDraftReferralAppointment,
    );
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
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(noSelectState),
        path: '/schedule-referral/date-time',
      },
    );
    sandbox.assert.notCalled(
      postDraftReferralAppointmentModule.postDraftReferralAppointment,
    );
    expect(screen.history.push.calledWith('/schedule-referral?id=UUID')).to.be
      .true;
  });
  it('should poll for appointment creation when "continue" is pressed', async () => {
    const clock = sinon.useFakeTimers({
      shouldAdvanceTime: false,
      now: new Date().getTime(),
      toFake: ['setTimeout', 'nextTick'],
    });
    sandbox
      .stub(postDraftReferralAppointmentModule, 'postReferralAppointment')
      .onFirstCall()
      .resolves(
        createReferralAppointment(draftAppointmentInfo.appointment.id, 'draft'),
      )
      .onSecondCall()
      .resolves(
        createReferralAppointment(
          draftAppointmentInfo.appointment.id,
          'confirmed',
        ),
      );

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );
    expect(screen.queryByTestId('continue-button')).to.exist;
    userEvent.click(screen.queryByTestId('continue-button'));
    await waitFor(() => {
      expect(screen.getByTestId('loading')).to.exist;
    });

    // advance the clock
    clock.runAll();
    sandbox.assert.calledTwice(
      postDraftReferralAppointmentModule.postReferralAppointment,
    );
  });
  it('should call "routeToNextReferralPage" when appointment creation is successful', async () => {
    sandbox.stub(flow, 'routeToNextReferralPage');

    sandbox
      .stub(postDraftReferralAppointmentModule, 'postReferralAppointment')
      .resolves(
        createReferralAppointment(
          draftAppointmentInfo.appointment.id,
          'confirmed',
        ),
      );

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );
    expect(screen.queryByTestId('continue-button')).to.exist;
    userEvent.click(screen.queryByTestId('continue-button'));
    await waitFor(() => {
      expect(screen.getByTestId('loading')).to.exist;
    });

    sandbox.assert.calledOnce(
      postDraftReferralAppointmentModule.postReferralAppointment,
    );

    sandbox.assert.calledOnce(flow.routeToNextReferralPage);
  });
});
