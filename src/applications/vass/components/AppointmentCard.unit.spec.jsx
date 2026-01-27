import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentCard from './AppointmentCard';
import { createAppointmentData } from '../utils/appointments';

describe('VASS Component: AppointmentCard', () => {
  it('renders card sections and actions', () => {
    const appointmentData = createAppointmentData({
      topics: [{ topicName: 'Benefits' }, { topicName: 'Health care' }],
    });

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
    const appointmentData = createAppointmentData();

    const { getByTestId, queryByTestId } = render(
      <AppointmentCard appointmentData={appointmentData} />,
    );

    expect(getByTestId('appointment-card')).to.exist;
    expect(queryByTestId('print-button')).to.not.exist;
    expect(queryByTestId('cancel-button')).to.not.exist;
  });

  it('omits topics section when no topics are provided', () => {
    const appointmentData = createAppointmentData({ topics: [] });

    const { queryByTestId } = render(
      <AppointmentCard appointmentData={appointmentData} />,
    );

    expect(queryByTestId('topics-section')).to.not.exist;
  });
});
