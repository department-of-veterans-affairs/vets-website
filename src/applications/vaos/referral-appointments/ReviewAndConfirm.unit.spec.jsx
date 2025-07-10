import React from 'react';
import { expect } from 'chai';
import sinon, { match } from 'sinon';
import { waitFor, userEvent } from '@testing-library/dom';

import * as utils from 'applications/vaos/services/utils';
import ReviewAndConfirm from './ReviewAndConfirm';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createReferralById, getReferralSlotKey } from './utils/referrals';
import { FETCH_STATUS } from '../utils/constants';
import { createDraftAppointmentInfo } from './utils/provider';
import * as flow from './flow';

describe('VAOS Component: ReviewAndConfirm', () => {
  let requestStub;
  const sandbox = sinon.createSandbox();
  const draftAppointmentInfo = createDraftAppointmentInfo(1);
  draftAppointmentInfo.attributes.slots[0].start = '2024-09-09T16:00:00.000Z';
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedSlot: '0',
      currentPage: 'reviewAndConfirm',
      appointmentCreateStatus: FETCH_STATUS.notStarted,
      pollingRequestStart: null,
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
    appointmentApi: {
      mutations: {
        postDraftReferralAppointmentCache: {
          status: 'fulfilled',
          data: draftAppointmentInfo,
        },
      },
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
    requestStub = sandbox.stub(utils, 'apiRequestWithUrl');
  });
  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
  });
  it('should get selected slot from session storage if not in redux', async () => {
    requestStub.resolves(draftAppointmentInfo);
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

    waitFor(() => {
      expect(screen.getByTestId('referral-layout-heading')).to.exist;
      expect(screen.getByTestId('slot-day-time')).to.contain.text(
        'Monday, September 9, 2024',
      );
      expect(screen.getByTestId('slot-day-time')).to.contain.text(
        '12:00 p.m. Eastern time (ET)',
      );
    });
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
    waitFor(() => {
      expect(screen.history.push.calledWith('/schedule-referral?id=UUID')).to.be
        .true;
    });
  });
  it('should call create appointment post when "continue" is pressed', async () => {
    // Stub the appointment creation function
    requestStub.resolves({ appointmentId: draftAppointmentInfo?.id });

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );

    waitFor(() => {
      expect(screen.queryByTestId('continue-button')).to.exist;

      userEvent.click(screen.queryByTestId('continue-button'));
    });

    waitFor(() => {
      sandbox.assert.calledOnce(
        requestStub.withArgs('/vaos/v2/appointments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftApppointmentId: draftAppointmentInfo.id,
            referralNumber: 'test-referral-number',
            slotId: draftAppointmentInfo.attributes.slots[0].id,
            networkId: draftAppointmentInfo.attributes.provider.networkIds[0],
            providerServiceId: draftAppointmentInfo.attributes.provider.id,
          }),
        }),
      );
    });
  });
  it('should call "routeToNextReferralPage" when appointment creation is successful', async () => {
    sandbox.spy(flow, 'routeToNextReferralPage');
    requestStub.resolves({ appointmentId: draftAppointmentInfo.id });

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );

    waitFor(() => {
      expect(screen.queryByTestId('continue-button')).to.exist;

      userEvent.click(screen.queryByTestId('continue-button'));
    });

    // Wait for the postReferralAppointment call to complete
    waitFor(() => {
      sandbox.assert.calledOnce(
        requestStub.withArgs('/vaos/v2/appointments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftApppointmentId: draftAppointmentInfo.id,
            referralNumber: 'test-referral-number',
            slotId: draftAppointmentInfo.attributes.slots.slots[0].id,
            networkId: draftAppointmentInfo.attributes.provider.networkIds[0],
            providerServiceId: draftAppointmentInfo.attributes.provider.id,
          }),
        }),
      );

      sandbox.assert.calledOnce(flow.routeToNextReferralPage);
    });
  });
  it('should display an error message when appointment creation fails', async () => {
    const expectedUrl = '/vaos/v2/appointments/submit';
    const expectedOptions = match({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: match(value => {
        try {
          const parsed = JSON.parse(value);
          return (
            parsed.draftApppointmentId &&
            parsed.referralNumber &&
            parsed.slotId &&
            parsed.networkId &&
            parsed.providerServiceId
          );
        } catch {
          return false;
        }
      }),
    });

    // Stub only for that specific call
    requestStub
      .withArgs(expectedUrl, expectedOptions)
      .rejects(new Error('Failed to create appointment'));

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );

    // Ensure the "Continue" button is present
    waitFor(() => {
      expect(screen.queryByTestId('continue-button')).to.exist;

      // Simulate clicking the "Continue" button
      userEvent.click(screen.queryByTestId('continue-button'));
    });

    // Wait for the error handling logic to execute
    waitFor(() => {
      // Verify that the error message is displayed
      expect(screen.getByTestId('create-error-alert')).to.exist;
      expect(screen.getByTestId('create-error-alert')).to.contain.text(
        'We couldn’t schedule this appointment',
      );

      // Ensure the loading state is cleared
      expect(screen.queryByTestId('continue-button')).to.have.attribute(
        'loading',
        'false',
      );
    });
  });
});
