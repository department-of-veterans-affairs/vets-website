import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import StatusAlert from '../StatusAlert';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  version: 2,
  vaos: {
    isCanceled: false,
    appointmentType: 'vaAppointment',
    isUpcomingAppointment: true,
    isPastAppointment: false,
    isCompAndPenAppointment: false,
  },
  videoData: {
    isVideo: false,
  },
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
};

const facilityData = new Facility();

describe('VAOS <StatusAlert> component', () => {
  const initialState = {
    featureToggles: {},
  };
  it('Should display confirmation of VA appointment alert message', () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'booked',
    };

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={appointment} facility={facilityData} />,
      {
        initialState,
        path: `/${appointment.id}?confirmMsg=true`,
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
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'booked',
    };

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={appointment} facility={facilityData} />,
      {
        initialState,
        path: `/${appointment.id}?confirmMsg=true`,
      },
    );
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    fireEvent.click(screen.queryByTestId('schedule-appointment-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-schedule-appointment-button-clicked',
    });
  });
  it('Should display cancellation alert message', () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'cancelled',
      cancelationReason: 'pat',
    };

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={appointment} facility={facilityData} />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    expect(screen.baseElement).to.contain('.usa-alert-error');
    expect(screen.baseElement).to.contain.text('You canceled your appointment');

    expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
  });
  it('Should display past appointment alert message', () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'booked',
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
      },
    };

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={appointment} facility={facilityData} />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    expect(screen.baseElement).to.contain('.usa-alert-warning');
    expect(screen.baseElement).to.contain.text(
      'This appointment occurred in the past',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
  });
});
describe('VAOS <StatusAlert> component with After visit summary link', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingAfterVisitSummary: true,
    },
  };
  it('Should display after visit summary link', () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'booked',
      avsPath: '/test-avs-path',
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
      },
    };

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={appointment} facility={facilityData} />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    expect(screen.baseElement).to.not.contain('.usa-alert-warning');
    expect(screen.queryByTestId('after-vist-summary-link')).to.exist;
  });
  it('Should record google analytics when after visit summary link is clicked ', () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'booked',
      avsPath: '/test-avs-path',
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
      },
    };

    const screen = renderWithStoreAndRouter(
      <StatusAlert appointment={appointment} facility={facilityData} />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    expect(screen.queryByTestId('after-vist-summary-link')).to.exist;
    fireEvent.click(screen.queryByTestId('after-vist-summary-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-after-visit-summary-link-clicked',
    });
  });
});
