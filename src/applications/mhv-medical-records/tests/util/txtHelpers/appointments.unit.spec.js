import { expect } from 'chai';
import { parseAppointments } from '../../../util/txtHelpers/appointments';

const appointments = [
  {
    date: '2024-09-13',
    appointmentType: 'Check-up',
    status: 'Confirmed',
    address: ['123 Main St', 'Suite 100'],
    isUpcoming: true,
    detailsShared: {
      reason: 'Routine check-up',
    },
  },
  {
    date: '2023-09-13',
    appointmentType: 'Follow-up',
    status: 'Completed',
    address: ['456 Elm St', 'Suite 200'],
    isUpcoming: false,
    detailsShared: {
      reason: '',
    },
  },
];

describe('parseAppointments', () => {
  it('should handle no appointments', () => {
    const result = parseAppointments([]);
    expect(result).to.contain('Showing 0 appointments');
  });

  it('should handle appointments with all fields populated', () => {
    const result = parseAppointments(appointments);
    expect(result).to.contain('Showing 1 appointments');
    expect(result).to.contain('Check-up');
    expect(result).to.contain('Follow-up');
  });

  it('should handle appointments with some missing fields', () => {
    const missingFieldAppointments = [
      {
        date: '',
        appointmentType: 'Check-up',
        status: 'Confirmed',
        address: [],
        isUpcoming: true,
        detailsShared: {
          reason: '',
        },
      },
    ];
    const result = parseAppointments(missingFieldAppointments);
    expect(result).to.contain('Showing 1 appointments');
    expect(result).to.contain('Check-up');
    expect(result).to.contain('Date: Unknown Date');
  });

  it('should handle both upcoming and past appointments', () => {
    const result = parseAppointments(appointments);
    expect(result).to.contain('Showing 1 appointments');
    expect(result).to.contain('Showing 1 appointments');
  });
});
