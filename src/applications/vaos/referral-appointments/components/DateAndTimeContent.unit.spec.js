import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import DateAndTimeContent from './DateAndTimeContent';
import { createReferralById, getReferralSlotKey } from '../utils/referrals';
import { createDraftAppointmentInfo } from '../utils/provider';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';

describe('VAOS Component: DateAndTimeContent', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      currentPage: 'scheduleAppointment',
      selectedSlot: null,
    },
  };
  const referral = createReferralById(
    '2024-12-05',
    'add2f0f4-a1ea-4dea-a504-a54ab57c68',
  );
  const appointmentsByMonth = {
    '2024-12': [
      {
        start: '2024-12-06T15:00:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 30,
      },
      {
        start: '2024-12-19T08:40:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
      },
    ],
    '2025-01': [
      {
        start: '2025-01-02T12:00:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
      },
      {
        start: '2025-01-19T08:40:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
      },
    ],
  };
  beforeEach(() => {
    MockDate.set('2024-12-05T05:00:00-05:00');
  });
  afterEach(() => {
    sessionStorage.clear();
    MockDate.reset();
  });
  it('should render DateAndTimeContent component', () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={createDraftAppointmentInfo(1)}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    expect(screen.getByTestId('cal-widget')).to.exist;
  });
  it('should show error if no date selected', async () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={createDraftAppointmentInfo(1)}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    const continueButton = await screen.findByRole('button', {
      name: /Continue/i,
    });
    fireEvent.click(continueButton);
    expect(
      await screen.getByText(
        'Please choose your preferred date and time for your appointment',
      ),
    ).to.exist;
  });
  it('should show error if conflicting appointment', async () => {
    const selectedSlotKey = getReferralSlotKey(referral.UUID);
    sessionStorage.setItem(
      selectedSlotKey,
      '5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov0',
    );
    const initialStateWithSelect = {
      featureToggles: {
        vaOnlineSchedulingCCDirectScheduling: true,
      },
      referral: {
        selectedSlot:
          '5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov0',
        currentPage: 'scheduleAppointment',
      },
    };
    const draftAppointmentInfo = createDraftAppointmentInfo(1);
    draftAppointmentInfo.slots.slots[0].start = '2024-12-06T15:00:00-05:00';
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={draftAppointmentInfo}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialStateWithSelect,
      },
    );
    const continueButton = await screen.findByRole('button', {
      name: /Continue/i,
    });
    fireEvent.click(continueButton);
    expect(
      await screen.getByText(
        'You already have an appointment at this time. Please select another day or time.',
      ),
    ).to.exist;
  });
  it('should select date if value in session storage', async () => {
    const selectedSlotKey = getReferralSlotKey(referral.UUID);
    sessionStorage.setItem(
      selectedSlotKey,
      '5vuTac8v-practitioner-1-role-2|e43a19a8-b0cb-4dcf-befa-8cc511c3999b|2025-01-02T15:30:00Z|30m0s|1736636444704|ov1',
    );
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={createDraftAppointmentInfo(2)}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
        path: '/schedule-referral/date-time',
      },
    );
    const continueButton = await screen.findByRole('button', {
      name: /Continue/i,
    });
    fireEvent.click(continueButton);
    // Routes to next page if selection exists
    expect(screen.history.push.called).to.be.true;
  });
  it('should show error if no slots available', async () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={createDraftAppointmentInfo(0)}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    expect(screen.getByTestId('no-slots-alert')).to.exist;
  });
});
