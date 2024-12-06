import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import DateAndTimeContent from './DateAndTimeContent';
import { createReferral } from '../utils/referrals';
import { createProviderDetails } from '../utils/provider';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';

describe('VAOS Component: DateAndTimeContent', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    newAppointment: {
      data: {
        selectedDates: [],
      },
    },
    referral: {
      currentPage: 'scheduleAppointment',
    },
  };
  const referral = createReferral(
    '2024-12-05',
    'add2f0f4-a1ea-4dea-a504-a54ab57c68',
  );
  const provider = createProviderDetails(1);
  const appointmentsByMonth = {
    '2024-12': [
      {
        start: '2024-12-06T12:00:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
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
    MockDate.set('2024-12-05T00:00:00Z');
  });
  afterEach(() => {
    sessionStorage.clear();
    MockDate.reset();
  });
  it('should render DateAndTimeContent component', () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        provider={provider}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );

    expect(screen.getByTestId('pick-heading')).to.exist;
    expect(screen.getByTestId('cal-widget')).to.exist;
  });
  it('should show error if no date selected', async () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        provider={provider}
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
    const selectedDateKey = `selected-date-referral-${referral.UUID}`;
    sessionStorage.setItem(selectedDateKey, '2024-12-06T17:00:00.000Z');
    const initialStateWithSelect = {
      featureToggles: {
        vaOnlineSchedulingCCDirectScheduling: true,
      },
      newAppointment: {
        data: {
          selectedDates: '2024-12-06T17:00:00.000Z',
        },
      },
    };
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        provider={provider}
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
    const selectedDateKey = `selected-date-referral-${referral.UUID}`;
    sessionStorage.setItem(selectedDateKey, '2024-12-06T19:00:00.000Z');
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        provider={createProviderDetails(2)}
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
});
