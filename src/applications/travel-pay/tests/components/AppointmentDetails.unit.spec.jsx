import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import AppointmentInfoText from '../../components/AppointmentInfoText';

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
  start: '2024-12-30T14:00:00Z',
  localStartTime: '2024-12-30T08:00:00.000-06:00',
  isPast: true,
  daysSinceAppt: null,
  isOutOfBounds: false,
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
};

describe('Appointment info text', () => {
  // The date in the appt is "2024-12-30T14:00:00Z"

  afterEach(() => {
    MockDate.reset();
  });

  it('should render correct text for if appt is over 30 days old', () => {
    MockDate.set('2025-02-28T14:00:00Z');
    const screen = render(
      <AppointmentInfoText
        appointment={{
          ...mockAppt,
          daysSinceAppt: 60,
          isOutOfBounds: true,
          travelPayClaim: {
            metadata: claimMeta,
          },
        }}
      />,
    );

    expect(screen.getByText(/Your appointment happened more than 30 days ago/i))
      .to.exist;
  });

  it('should render correct text for if appt is less than 30 days old', () => {
    MockDate.set('2025-01-03T14:00:00Z');
    const screen = render(
      <AppointmentInfoText
        appointment={{
          ...mockAppt,
          daysSinceAppt: 4,
          isOutOfBounds: false,
          travelPayClaim: {
            metadata: claimMeta,
          },
        }}
      />,
    );

    expect(
      screen.getByText(/We encourage you to file your claim within 30 days/i),
    ).to.exist;
  });

  it('should render an alert if appt is in the future', () => {
    const screen = render(
      <AppointmentInfoText
        appointment={{
          ...mockAppt,
          isPast: false,
          travelPayClaim: {
            metadata: claimMeta,
          },
        }}
      />,
    );

    expect(screen.getByText(/We need to wait to file your claim/i)).to.exist;
  });

  it('should render a link to existing travel claim', () => {
    const screen = render(
      <AppointmentInfoText
        appointment={{
          ...mockAppt,
          daysSinceAppt: 60,
          isOutOfBounds: true,
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
