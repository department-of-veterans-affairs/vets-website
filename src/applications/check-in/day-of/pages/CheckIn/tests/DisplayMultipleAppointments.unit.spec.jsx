import React from 'react';
import { expect } from 'chai';
import format from 'date-fns/format';
import { render } from '@testing-library/react';

import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import DisplayMultipleAppointments from '../DisplayMultipleAppointments';

describe('check-in', () => {
  describe('DisplayMultipleAppointments component', () => {
    it('shows appointment details progress', () => {
      const token = 'token-123';
      const appointments = [
        {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        },
      ];

      const checkIn = render(
        <CheckInProvider>
          <DisplayMultipleAppointments
            token={token}
            appointments={appointments}
          />
        </CheckInProvider>,
      );

      expect(checkIn.getAllByRole('list')).to.exist;

      expect(checkIn.getByTestId('date-text')).to.exist;
      expect(checkIn.getByTestId('date-text')).to.have.text(
        `Here are your appointments for today: ${format(
          new Date(),
          'MMMM dd, yyyy',
        )}.`,
      );

      expect(checkIn.getByTestId('appointment-time')).to.exist;
      expect(checkIn.getByTestId('appointment-time').innerHTML).to.match(
        /([\d]|[\d][\d]):[\d][\d]/,
      );
    });
    it('shows the back button by default', () => {
      const token = 'token-123';
      const appointments = [
        {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        },
      ];

      const checkIn = render(
        <CheckInProvider>
          <DisplayMultipleAppointments
            token={token}
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(checkIn.getByTestId('back-button')).to.exist;
    });
    it('renders the travel warning alert if travel reimbursement is disabled', () => {
      const token = 'token-123';
      const appointments = [
        {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        },
      ];
      const initState = {
        features: {
          /* eslint-disable-next-line camelcase */
          check_in_experience_travel_reimbursement: false,
        },
      };
      const { getByTestId } = render(
        <CheckInProvider store={initState}>
          <DisplayMultipleAppointments
            token={token}
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(getByTestId('travel-btsss-message')).to.exist;
    });
    it('shows the date & time the appointments were loaded & a refresh link', () => {
      const token = 'token-123';
      const appointments = [
        {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        },
      ];

      const checkIn = render(
        <CheckInProvider>
          <DisplayMultipleAppointments
            token={token}
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(checkIn.getByTestId('update-text')).to.have.text(
        `Latest update: ${format(new Date(), "MMMM d, yyyy 'at' h:mm aaaa")}`,
      );
      expect(checkIn.queryByTestId('refresh-appointments-button')).to.exist;
    });
  });
});
