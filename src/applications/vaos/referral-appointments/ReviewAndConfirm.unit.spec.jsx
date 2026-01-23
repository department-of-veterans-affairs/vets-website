import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  createPostHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import ReviewAndConfirm from './ReviewAndConfirm';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createReferralById, getReferralSlotKey } from './utils/referrals';
import { FETCH_STATUS } from '../utils/constants';
import { createDraftAppointmentInfo } from './utils/provider';
import * as flow from './flow';
import { vaosApi } from '../redux/api/vaosApi';
import {
  generateSlotsForDay,
  transformSlotsForCommunityCare,
} from '../services/mocks/utils/slots';

describe('VAOS Component: ReviewAndConfirm', () => {
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
  afterEach(async () => {
    await cleanup();
    sandbox.restore();
    server.resetHandlers();
    sessionStorage.clear();
    // Reset RTK Query cache to prevent test pollution
    vaosApi.util.resetApiState();
  });
  it('should get selected slot from session storage if not in redux', async () => {
    // Set up MSW handler BEFORE render - eliminates race condition
    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        () => jsonResponse({ data: draftAppointmentInfo }),
      ),
    );

    const selectedSlotKey = getReferralSlotKey('UUID');

    // Store the slot start time - this should match the slot.start format used by getSlotByDate
    sessionStorage.setItem(selectedSlotKey, slotDate);

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

    await waitFor(() => {
      expect(screen.getByTestId('referral-layout-heading')).to.exist;
      expect(screen.getByTestId('slot-day-time')).to.contain.text(
        'Monday, September 9, 2024',
      );
      expect(screen.getByTestId('slot-day-time')).to.contain.text(
        '12:00 p.m. ET',
      );
    });
  });
  it('should route to scheduleReferral if no slot selected', async () => {
    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        () => jsonResponse({ data: draftAppointmentInfo }),
      ),
    );

    const selectedSlotKey = getReferralSlotKey('UUID');
    sessionStorage.removeItem(selectedSlotKey);

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
    await waitFor(() => {
      expect(screen.history.push.calledWith('/schedule-referral?id=UUID')).to.be
        .true;
    });
  });
  it('should call create appointment post when "continue" is pressed', async () => {
    let draftCalled = false;
    let submitCalled = false;

    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        () => {
          draftCalled = true;
          return jsonResponse({ data: draftAppointmentInfo });
        },
      ),
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/submit`,
        () => {
          submitCalled = true;
          return jsonResponse({
            data: { appointmentId: draftAppointmentInfo?.id },
          });
        },
      ),
    );

    const store = createTestStore(initialFullState);

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );
    await screen.findByTestId('continue-button');
    await userEvent.click(screen.getByTestId('continue-button'));
    await waitFor(() => {
      expect(draftCalled).to.be.true;
    });
    await waitFor(() => {
      expect(submitCalled).to.be.true;
    });
  });
  it('should call "routeToNextReferralPage" when appointment creation is successful', async () => {
    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        () => jsonResponse({ data: draftAppointmentInfo }),
      ),
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/submit`,
        () => jsonResponse({ data: draftAppointmentInfo }),
      ),
    );

    const store = createTestStore(initialEmptyState);
    sandbox.spy(flow, 'routeToNextReferralPage');

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
  });
  it('should display an error message when appointment creation fails', async () => {
    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        () => jsonResponse({ data: draftAppointmentInfo }),
      ),
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/submit`,
        () =>
          jsonResponse(
            { error: { status: 500, message: 'Failed to create appointment' } },
            { status: 500 },
          ),
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
    // Ensure the "Continue" button is present
    await screen.findByTestId('continue-button');
    expect(screen.getByTestId('continue-button')).to.exist;
    await userEvent.click(screen.getByTestId('continue-button'));

    await screen.findByTestId('create-error-alert');
    expect(screen.getByTestId('create-error-alert')).to.contain.text(
      'We couldn’t schedule this appointment',
    );
    expect(screen.getByTestId('referral-community-care-office')).to.exist;
  });
  it('should fetch draft appointment info on mount if not in store', async () => {
    let capturedBody = null;

    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        ({ request }) => {
          // MSW v1 uses req.body, MSW v2 uses request.json()
          capturedBody = request.body || null;
          return jsonResponse({ data: draftAppointmentInfo });
        },
      ),
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/submit`,
        () => jsonResponse({ data: draftAppointmentInfo }),
      ),
    );

    const store = createTestStore(initialEmptyState);

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );

    // Wait for the draft appointment to be fetched and query to be in store
    await waitFor(() => {
      const queries = Object.keys(store.getState().appointmentApi.queries);
      expect(queries.length).to.be.greaterThan(0);
    });

    await screen.findByTestId('continue-button');

    // Verify the request body
    expect(capturedBody).to.deep.equal({
      /* eslint-disable camelcase */
      referral_number: 'VA0000007241',
      referral_consult_id: '984_646907',
      /* eslint-enable camelcase */
    });
  });
  it('should display an error message when new draft appointment creation fails', async () => {
    server.use(
      createPostHandler(
        `${environment.API_URL}/vaos/v2/appointments/draft`,
        () =>
          jsonResponse(
            {
              error: {
                status: 500,
                message: 'Failed to create draft appointment',
              },
            },
            { status: 500 },
          ),
      ),
    );

    const store = createTestStore(initialEmptyState);

    const screen = renderWithStoreAndRouter(
      <ReviewAndConfirm
        currentReferral={createReferralById('2024-09-09', 'UUID')}
      />,
      {
        store,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('error')).to.exist;
    });
    expect(screen.getByTestId('error')).to.contain.text(
      'Something went wrong on our end. Please try again later.',
    );
  });
});
