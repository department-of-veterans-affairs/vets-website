import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentCard from './AppointmentCard';

describe('VASS Component: AppointmentCard', () => {
  it('renders card sections and actions', () => {
    const appointmentData = {
      appointmentId: '123',
      phoneNumber: '8005551212',
      dtStartUtc: '2025-05-01T16:00:00.000Z',
      typeOfCare: 'Solid Start',
      providerName: 'Bill Brasky',
      topics: [{ topicName: 'Benefits' }, { topicName: 'Health care' }],
      showAddToCalendarButton: true,
    };

    const { getByTestId } = render(
      <AppointmentCard
        appointmentData={appointmentData}
        handleCancelAppointment={() => {}}
      />,
    );

    expect(getByTestId('appointment-card')).to.exist;
    expect(getByTestId('appointment-type').textContent).to.equal(
      'Phone appointment',
    );
    expect(getByTestId('how-to-join-section')).to.exist;
    expect(getByTestId('when-section')).to.exist;
    expect(getByTestId('what-section')).to.exist;
    expect(getByTestId('who-section')).to.exist;
    expect(getByTestId('topics-section').textContent).to.contain(
      'Benefits, Health care',
    );
    expect(getByTestId('add-to-calendar-button')).to.exist;
    expect(getByTestId('print-button')).to.exist;
    expect(getByTestId('cancel-button')).to.exist;
  });

  it('omits calendar and cancel actions when not provided', () => {
    const appointmentData = {
      appointmentId: '456',
      phoneNumber: '8005551212',
      dtStartUtc: '2025-06-01T16:00:00.000Z',
      typeOfCare: 'Solid Start',
      providerName: 'Bill Brasky',
      topics: [{ topicName: 'Benefits' }],
      showAddToCalendarButton: false,
    };

    const { getByTestId, queryByTestId } = render(
      <AppointmentCard appointmentData={appointmentData} />,
    );

    expect(getByTestId('appointment-card')).to.exist;
    expect(queryByTestId('add-to-calendar-button')).to.not.exist;
    expect(queryByTestId('print-button')).to.not.exist;
    expect(queryByTestId('cancel-button')).to.not.exist;
  });
});
