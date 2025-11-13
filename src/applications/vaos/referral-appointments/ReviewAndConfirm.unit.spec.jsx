import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
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
import {
  generateSlotsForDay,
  transformSlotsForCommunityCare,
} from '../services/mocks/utils/slots';

describe('VAOS Component: ReviewAndConfirm', () => {
  let requestStub;
  const slotDate = '2024-09-09T16:00:00.000Z';
  const sandbox = sinon.createSandbox();
  const draftAppointmentInfo = createDraftAppointmentInfo();

  // Create a slot object with the expected flattened structure and proper slot ID format
  const slots = generateSlotsForDay(slotDate, {
    slotsPerDay: 1,
    slotDuration: 60,
    businessHours: {
      start: 12,
      end: 18,
    },
  });
  draftAppointmentInfo.attributes.slots = transformSlotsForCommunityCare(slots);
  draftAppointmentInfo.attributes.slots[0].start = slotDate;
  const initialFullState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedSlotStartTime: '2024-09-09T16:00:00.000Z',
      draftAppointmentInfo,
      currentPage: 'reviewAndConfirm',
      appointmentCreateStatus: FETCH_STATUS.notStarted,
      pollingRequestStart: null,
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
  };
  const initialEmptyState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      selectedSlotStartTime: '2024-09-09T16:00:00.000Z',
      draftAppointmentInfo: {},
      currentPage: 'reviewAndConfirm',
      appointmentCreateStatus: FETCH_STATUS.notStarted,
      pollingRequestStart: null,
      appointmentInfoError: false,
      appointmentInfoLoading: false,
      referralAppointmentInfo: {},
    },
    appointmentApi: {},
  };
  beforeEach(() => {
    requestStub = sandbox.stub(utils, 'apiRequestWithUrl');
  });
  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
  });
  it('should get selected slot from session storage if not in redux', async () => {
    requestStub
      .withArgs('/vaos/v2/appointments/draft')
      .resolves({ data: draftAppointmentInfo });
    const selectedSlotKey = getReferralSlotKey('UUID');

    sessionStorage.setItem(
      selectedSlotKey,
      '5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov0',
    );

    const noSelectState = {
      ...initialFullState,
      ...{
        referral: { ...initialFullState.referral, selectedSlotStartTime: '' },
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
    requestStub
      .withArgs('/vaos/v2/appointments/draft')
      .resolves({ data: draftAppointmentInfo });
    const noSelectState = {
      ...initialFullState,
      ...{
        referral: { ...initialFullState.referral, selectedSlotStartTime: '' },
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
    const store = createTestStore(initialFullState);
    // Stub the appointment creation function
    requestStub
      .withArgs('/vaos/v2/appointments/draft')
      .resolves({ data: draftAppointmentInfo });
    requestStub
      .withArgs('/vaos/v2/appointments/submit')
      .resolves({ data: { appointmentId: draftAppointmentInfo?.id } });

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );
    await screen.findByTestId('continue-button');
    waitFor(() => {
      userEvent.click(screen.queryByTestId('continue-button'));
    });
    sandbox.assert.calledOnce(
      requestStub.withArgs('/vaos/v2/appointments/draft'),
    );
    sandbox.assert.calledOnce(
      requestStub.withArgs('/vaos/v2/appointments/submit'),
    );
  });
  it('should call "routeToNextReferralPage" when appointment creation is successful', async () => {
    const store = createTestStore(initialEmptyState);
    sandbox.spy(flow, 'routeToNextReferralPage');
    requestStub.resolves({ data: draftAppointmentInfo });

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
    expect(
      Object.keys(store.getState().appointmentApi.queries).length,
    ).to.equal(1);
    await userEvent.click(screen.getByTestId('continue-button'));
    await waitFor(() => {
      const mutation = Object.keys(
        store.getState().appointmentApi.mutations,
      )[0];
      expect(
        store.getState().appointmentApi.mutations[mutation].status,
      ).to.equal('fulfilled');
    });
    await waitFor(() => {
      expect(
        Object.keys(store.getState().appointmentApi.queries).length,
      ).to.equal(0);
    });
    await waitFor(() => {
      expect(
        screen.history.push.calledWith(
          '/schedule-referral/complete/EEKoGzEf?id=UUID',
        ),
      ).to.be.true;
    });
    expect(
      screen.history.push.calledWith(
        '/schedule-referral/complete/EEKoGzEf?id=UUID',
      ),
    ).to.be.true;
    sandbox.assert.calledWith(requestStub, '/vaos/v2/appointments/submit');
  });
  it('should display an error message when appointment creation fails', async () => {
    // Stub only for that specific call
    requestStub
      .withArgs('/vaos/v2/appointments/draft')
      .resolves({ data: draftAppointmentInfo });
    requestStub.withArgs('/vaos/v2/appointments/submit').throws({
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

    await screen.findByTestId('create-error-alert');
    expect(screen.getByTestId('create-error-alert')).to.contain.text(
      'We couldn’t schedule this appointment',
    );
    expect(screen.getByTestId('referral-community-care-office')).to.exist;
    sandbox.assert.calledOnce(
      requestStub.withArgs('/vaos/v2/appointments/draft'),
    );
    sandbox.assert.calledOnce(
      requestStub.withArgs('/vaos/v2/appointments/submit'),
    );
  });
  it('should fetch draft appointment info on mount if not in store', async () => {
    const store = createTestStore(initialEmptyState);
    requestStub.resolves({ data: draftAppointmentInfo });
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );
    await screen.findByTestId('continue-button');
    sandbox.assert.calledWith(requestStub, '/vaos/v2/appointments/draft', {
      body: JSON.stringify({
        /* eslint-disable camelcase */
        referral_number: 'VA0000007241',
        referral_consult_id: '984_646907',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const query = Object.keys(store.getState().appointmentApi.queries)[0];
    expect(store.getState().appointmentApi.queries[query].data).to.deep.equal(
      draftAppointmentInfo,
    );
  });
  it('should display an error message when new draft appointment creation fails', async () => {
    const store = createTestStore(initialEmptyState);
    // Stub only for that specific call
    requestStub.throws({
      error: { status: 500, message: 'Failed to create draft appointment' },
    });
    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-container'),
    );
    await waitFor(() => {
      expect(screen.getByTestId('error')).to.exist;
    });
    expect(screen.getByTestId('error')).to.contain.text(
      'Something went wrong on our end. Please try again later.',
    );
    sandbox.assert.calledOnce(requestStub);
  });
});
