import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentCard from './AppointmentCard';

describe('VASS Component: AppointmentCard', () => {
  it('renders card sections and actions', () => {
    const appointmentData = {
      appointmentId: '123',
      startUTC: '2025-05-01T16:00:00.000Z',
      endUTC: '2025-05-01T16:30:00.000Z',
      agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
      agentNickname: 'Bill Brasky',
      appointmentStatusCode: 1,
      appointmentStatus: 'Confirmed',
      cohortStartUtc: '2025-01-01T00:00:00.000Z',
      cohortEndUtc: '2025-12-31T23:59:59.999Z',
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
    expect(getByTestId('solid-start-telephone')).to.exist;
    expect(
      getByTestId('solid-start-telephone').getAttribute('contact'),
    ).to.equal('8008270611');
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
      startUTC: '2025-06-01T16:00:00.000Z',
      endUTC: '2025-06-01T16:30:00.000Z',
      agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
      agentNickname: 'Bill Brasky',
      appointmentStatusCode: 1,
      appointmentStatus: 'Confirmed',
      cohortStartUtc: '2025-01-01T00:00:00.000Z',
      cohortEndUtc: '2025-12-31T23:59:59.999Z',
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

  it('omits topics section when no topics are provided', () => {
    const appointmentData = {
      appointmentId: '789',
      startUTC: '2025-07-01T16:00:00.000Z',
      endUTC: '2025-07-01T16:30:00.000Z',
      agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
      agentNickname: 'Bill Brasky',
      appointmentStatusCode: 1,
      appointmentStatus: 'Confirmed',
      cohortStartUtc: '2025-01-01T00:00:00.000Z',
      cohortEndUtc: '2025-12-31T23:59:59.999Z',
      topics: [],
    };
    const { queryByTestId } = render(
      <AppointmentCard appointmentData={appointmentData} />,
    );

    expect(queryByTestId('topics-section')).to.not.exist;
  });
});
