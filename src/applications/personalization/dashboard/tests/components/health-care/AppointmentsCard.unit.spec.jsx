import React from 'react';
import { format, parseISO } from 'date-fns';
import { expect } from 'chai';
import { getAppointmentTimezone } from '../../../utils/timezone';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import { AppointmentsCard } from '../../../components/health-care/AppointmentsCard';

describe('<AppointmentsCard />', () => {
  const initialState = {
    user: {},
  };

  it('should render with appointments', () => {
    const appointments = [
      {
        id: '123',
        additionalInfo: 'yada yada yada',
        isVideo: true,
        providerName: 'test provider',
        startsAt: '2023-12-04T10:00:00-05:00',
        timeZone: 'MT',
        type: 'regular',
      },
    ];

    const startFns = parseISO(appointments[0].startsAt);
    const startFormatted = format(startFns, 'eeee, MMMM d, yyyy');
    const timeZone = getAppointmentTimezone(appointments[0]);
    const tree = renderInReduxProvider(
      <AppointmentsCard appointments={appointments} />,
      {
        ...initialState,
        health: {
          appointments: { appointments },
        },
      },
    );

    tree.getByTestId('health-care-appointments-card');
    tree.getByText('Next appointment');
    tree.getByText('Schedule and manage your appointments');
    tree.getByRole('link', {
      name: /schedule and manage your appointments/i,
      value: {
        text: '/my-health/appointments',
      },
    });
    tree.getByText('VA Video Connect yada yada yada');
    tree.getByText(startFormatted);
    tree.getByText(
      `Time: ${format(startFns, 'h:mm aaaa')} ${timeZone.abbreviation}`,
    );
  });

  context('renders the location name', () => {
    it('when the appointment is a video appointment', () => {
      const appointments = [
        {
          startsAt: '2023-12-04T10:00:00-05:00',
          isVideo: true,
          additionalInfo: 'testing',
        },
      ];

      const tree = renderInReduxProvider(
        <AppointmentsCard appointments={appointments} />,
        {
          ...initialState,
          health: {
            appointments: { appointments },
          },
        },
      );

      tree.getByText('VA Video Connect testing');

      expect(
        tree.getByRole('link', {
          name: /schedule and manage your appointments/i,
          value: {
            text: '/my-health/appointments',
          },
        }),
      ).to.exist;
    });

    it("when the appointment isn't a video appointment", () => {
      const providerName = 'test provider';
      const appointments = [
        {
          startsAt: '2023-12-04T10:00:00-05:00',
          isVideo: false,
          providerName,
        },
      ];
      const tree = renderInReduxProvider(
        <AppointmentsCard appointments={appointments} />,
        {
          ...initialState,
          health: {
            appointments: { appointments },
          },
        },
      );

      tree.getByText(providerName);
      tree.getByRole('link', {
        name: /schedule and manage your appointments/i,
        value: {
          text: '/my-health/appointments',
        },
      });
    });
  });
});
