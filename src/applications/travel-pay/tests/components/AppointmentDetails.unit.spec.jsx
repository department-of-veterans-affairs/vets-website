import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentDetails from '../../components/AppointmentDetails';

const mockAppt = {
  practitioners: [
    {
      name: {
        family: 'BERNARDO',
        given: ['KENNETH J'],
      },
    },
  ],
  start: '2024-12-30T14:00:00Z',
  localStartTime: '2024-12-30T08:00:00.000-06:00',
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
  facilityData: {
    name: 'Cheyenne VA Medical Center',
  },
};

describe('Appointment details', () => {
  const props = {
    appointment: mockAppt,
  };

  it('should render appointment details', () => {
    const screen = render(<AppointmentDetails {...props} />);

    expect(screen.getByText(/December 30/i)).to.exist;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.exist;
  });
});
