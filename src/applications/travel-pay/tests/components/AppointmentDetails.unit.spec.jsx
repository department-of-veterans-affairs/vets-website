import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import AppointmentDetails from '../../components/AppointmentDetails';

const claimMeta = {
  status: 200,
  success: true,
  message: 'Data retrieved successfully',
};

const claimInfo = {
  id: '16cbc3d0-56de-4d86-abf3-ed0f6908ee53',
  claimNumber: '5b550fe7-6985-4a69-953a-472d5cf85921',
  claimStatus: 'In Process',
  appointmentDateTime: '2023-02-23T22:22:52.549Z',
  facilityName: 'Tomah VA Medical Center',
  createdOn: '2023-02-24T22:22:52.549Z',
  modifiedOn: '2023-02-26T22:22:52.549Z',
};

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
  it('should render appointment details with original appointment object', () => {
    const screen = render(<AppointmentDetails appointment={mockAppt} />);

    expect(screen.getByText(/December 30/i)).to.exist;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.exist;
  });

  it('should render appointment details if no claim present', () => {
    const screen = render(
      <AppointmentDetails
        appointment={{
          ...mockAppt,
          travelPayClaim: {
            metadata: claimMeta,
          },
        }}
      />,
    );

    expect(screen.getByText(/December 30/i)).to.exist;
    expect(screen.getByText(/Cheyenne VA Medical Center/i)).to.exist;
  });

  it('should render a link to existing travel claim', () => {
    const screen = render(
      <AppointmentDetails
        appointment={{
          ...mockAppt,
          travelPayClaim: {
            metadata: claimMeta,
            claim: claimInfo,
          },
        }}
      />,
    );

    expect(screen.getByText(/already filed/i)).to.exist;
    expect($('va-link-action[text="View your claim details"]')).to.exist;
  });
});
