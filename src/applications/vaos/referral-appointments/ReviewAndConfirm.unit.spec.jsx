import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
  const slotDate = '2024-09-09T16:00:00.000Z';
  const sandbox = sinon.createSandbox();
  const draftAppointmentInfo = createDraftAppointmentInfo(1);

  draftAppointmentInfo.attributes.slots[0].start = slotDate;
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedSlot: '2024-09-09T16:00:00.000Z',
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
      ...{
        referral: {
          ...initialFullState.referral,
          selectedSlotStartTime: '',
        },
      },
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
      ...{
        referral: {
          ...initialFullState.referral,
          selectedSlotStartTime: '',
        },
      },
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
    const store = createTestStore(initialFullState);
    sandbox.spy(flow, 'routeToNextReferralPage');
    requestStub.resolves({ data: { appointmentId: draftAppointmentInfo.id } });
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );
    await screen.findByTestId('continue-button');
    expect(screen.getByTestId('continue-button')).to.exist;
    await userEvent.click(screen.getByTestId('continue-button'));
    // Wait for the postReferralAppointment call to complete
    waitFor(() =>
      expect(screen.getByTestId('continue-button')).to.have.attribute(
        'loading',
        'false',
      ),
    );
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
    await waitFor(() => {
      expect(
        store.getState().appointmentApi.mutations.postReferralAppointmentCache
          .status,
      ).to.equal('fulfilled');
    });
    waitFor(() => {
      expect(
        screen.history.push.calledWith(
          '/schedule-referral/complete/EEKoGzEf?id=UUID',
        ),
      ).to.be.true;
    });
  });
  it('should display an error message when appointment creation fails', async () => {
    // Stub only for that specific call
    requestStub.throws({
      error: { status: 500, message: 'Failed to create appointment' },
    });
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store: createTestStore(initialFullState),
      },
    );
    // Ensure the "Continue" button is present
    await screen.findByTestId('continue-button');
    expect(screen.getByTestId('continue-button')).to.exist;
    await userEvent.click(screen.getByTestId('continue-button'));
    // Wait for the postReferralAppointment call to complete
    waitFor(() =>
      expect(screen.getByTestId('continue-button')).to.have.attribute(
        'loading',
        'false',
      ),
    );
    await screen.findByTestId('create-error-alert');
    expect(screen.getByTestId('create-error-alert')).to.contain.text(
      'We couldn’t schedule this appointment',
    );
    sandbox.assert.calledOnce(requestStub);
  });
});
