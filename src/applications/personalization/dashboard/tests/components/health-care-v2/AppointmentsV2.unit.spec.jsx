import React from 'react';
import { render } from '@testing-library/react';
import moment from 'moment';
import { getAppointmentTimezone } from '../../../utils/timezone';

import { AppointmentsCard } from '../../../components/health-care-v2/AppointmentsV2';

describe('<AppointmentsCard />', () => {
  it('should render without appointments', () => {
    const start = moment.parseZone();
    const startFormatted = start.format('dddd, MMMM Do, YYYY');
    const timeZone = getAppointmentTimezone();
    const tree = render(<AppointmentsCard />);

    tree.getByTestId('health-care-appointments-card-v2');
    tree.getByText('Next appointment');
    tree.getByText('Schedule and manage your appointments');
    tree.getByText(startFormatted);
    tree.getByText(`Time: ${start.format('h:mm a')} ${timeZone.abbreviation}`);
  });

  it('should render with appointments', () => {
    const appointments = [
      {
        id: '123',
        additionalInfo: 'yada yada yada',
        isVideo: true,
        providerName: 'test provider',
        startsAt: '2023-04-11T15:34:12.224Z',
        timeZone: 'MT',
        type: 'regular',
      },
    ];
    const start = moment.parseZone(appointments[0].startsAt);
    const startFormatted = start.format('dddd, MMMM Do, YYYY');
    const timeZone = getAppointmentTimezone(appointments[0]);
    const tree = render(<AppointmentsCard appointments={appointments} />);

    tree.getByTestId('health-care-appointments-card-v2');
    tree.getByText('Next appointment');
    tree.getByText('Schedule and manage your appointments');
    tree.getByText('VA Video Connect yada yada yada');
    tree.getByText(startFormatted);
    tree.getByText(`Time: ${start.format('h:mm a')} ${timeZone.abbreviation}`);
  });

  context('renders the location name', () => {
    it('when the appointment is a video appointment', () => {
      const appointments = [
        {
          isVideo: true,
          additionalInfo: 'testing',
        },
      ];
      const tree = render(<AppointmentsCard appointments={appointments} />);

      tree.getByText('VA Video Connect testing');
    });

    it("when the appointment isn't a video appointment", () => {
      const providerName = 'test provider';
      const appointments = [
        {
          isVideo: false,
          providerName,
        },
      ];
      const tree = render(<AppointmentsCard appointments={appointments} />);

      tree.getByText(providerName);
    });
  });
});
