import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

import moment from 'moment';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import StatusAlert from './StatusAlert';
import { Facility, MockAppointment } from '../tests/mocks/unit-test-helpers';

const facilityData = new Facility();

describe('VAOS Component: StatusAlert', () => {
  const initialState = {};
  it('Should display confirmation of VA appointment alert message', () => {
    const mockAppointment = new MockAppointment({ start: moment() });
    mockAppointment.setKind('clinic');
    mockAppointment.setStatus('booked');

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}?confirmMsg=true`,
      },
    );
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'We’ve scheduled and confirmed your appointment',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    // record GA when review appointments link is clicked
    fireEvent.click(screen.queryByTestId('review-appointments-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-view-your-appointments-button-clicked',
    });
  });
  it('Should record google analytics when schedule link is clicked ', () => {
    const mockAppointment = new MockAppointment({ start: moment() });
    mockAppointment.setKind('clinic');
    mockAppointment.setStatus('booked');

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}?confirmMsg=true`,
      },
    );
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    fireEvent.click(screen.queryByTestId('schedule-appointment-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-schedule-appointment-button-clicked',
    });
  });
  it('Should display cancellation alert message', () => {
    const mockAppointment = new MockAppointment({ start: moment() });
    mockAppointment.setKind('clinic');
    mockAppointment.setStatus('cancelled');
    mockAppointment.setCancelationReason('pat');

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={mockAppointment} facility={facilityData} />,
      {
        initialState,
        path: `/${mockAppointment.id}`,
      },
    );
    expect(screen.baseElement).to.contain('.usa-alert-error');
    expect(screen.baseElement).to.contain.text('You canceled this appointment');

    expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
  });
});
