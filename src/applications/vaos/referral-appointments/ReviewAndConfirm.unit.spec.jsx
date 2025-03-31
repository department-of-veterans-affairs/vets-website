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
      pollingRequestStart: null,
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
  };
  // TODO - add test for when draftAppointmentInfo is empty
  // const initialEmptyState = {
  //   featureToggles: {
  //     vaOnlineSchedulingCCDirectScheduling: true,
  //   },
  //   referral: {
  //     draftAppointmentInfo: {},
  //     draftAppointmentCreateStatus: FETCH_STATUS.notStarted,
  //     appointmentCreateStatus: FETCH_STATUS.notStarted,
  //     pollingRequestStart: null,
  //     appointmentInfoError: false,
  //     appointmentInfoLoading: false,
  //   },
  // };
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

    expect(screen.getByTestId('referral-layout-heading')).to.exist;
    expect(screen.getByTestId('slot-day-time')).to.contain.text(
      'Monday, September 9, 2024',
    );
    expect(screen.getByTestId('slot-day-time')).to.contain.text(
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
  it('should call call create appointment post when "continue" is pressed', async () => {
    // Stub the appointment cration function
    sandbox
      .stub(postDraftReferralAppointmentModule, 'postReferralAppointment')
      .resolves({ appointmentId: draftAppointmentInfo.appointment.id });

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
      sandbox.assert.calledOnce(
        postDraftReferralAppointmentModule.postReferralAppointment,
      );
    });
  });
  it('should call "routeToNextReferralPage" when appointment creation is successful', async () => {
    sandbox.spy(flow, 'routeToNextReferralPage');
    sandbox
      .stub(postDraftReferralAppointmentModule, 'postReferralAppointment')
      .resolves({ appointmentId: draftAppointmentInfo.appointment.id });

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

    // Wait for the postReferralAppointment call to complete
    await waitFor(() => {
      sandbox.assert.calledOnce(
        postDraftReferralAppointmentModule.postReferralAppointment,
      );
    });

    sandbox.assert.calledOnce(flow.routeToNextReferralPage);
  });
});
