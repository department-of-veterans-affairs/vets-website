import React from 'react';
import { expect } from 'chai';

import { fireEvent } from '@testing-library/react';

import { Facility } from '../../../tests/mocks/unit-test-helpers';

import RequestedStatusAlert from '../RequestedStatusAlert';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingVAOSServiceRequests: true,
    vaOnlineSchedulingVAOSServiceCCAppointments: true,
  },
};

const appointmentData = {
  id: '1234',
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
  vaos: {
    appointmentType: 'request',
  },
};
const facilityData = new Facility();

describe('VAOS Page: RequestedAppointmentDetailsPage with VAOS service', () => {
  it('should display new appointment confirmation alert for VA request', async () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'proposed',
    };

    const screen = renderWithStoreAndRouter(
      <RequestedStatusAlert
        appointment={appointment}
        facility={facilityData}
      />,
      {
        initialState: initialStateVAOSService,
        path: `/requests/${appointment.id}?confirmMsg=true`,
      },
    );

    expect(await screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request and contact you to schedule the first available appointment.',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    // click review appointment link
    fireEvent.click(screen.queryByTestId('review-appointments-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-view-your-appointments-button-clicked',
    });
  });
  it('should display new appointment confirmation alert for CC request', async () => {
    const appointment = {
      ...appointmentData,
      kind: 'cc',
      status: 'proposed',
      vaos: {
        appointmentType: 'ccRequest',
      },
    };

    const screen = renderWithStoreAndRouter(
      <RequestedStatusAlert
        appointment={appointment}
        facility={facilityData}
      />,
      {
        initialState: initialStateVAOSService,
        path: `/requests/${appointment.id}?confirmMsg=true`,
      },
    );

    expect(await screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request and contact you to schedule the first available appointment.',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    // click schedule appointment link
    fireEvent.click(screen.queryByTestId('schedule-appointment-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-schedule-appointment-button-clicked',
    });
  });
  it('should display appointment cancellation alert for VA request', async () => {
    const appointment = {
      ...appointmentData,
      kind: 'clinic',
      status: 'cancelled',
      cancelationReason: 'pat',
    };

    const screen = renderWithStoreAndRouter(
      <RequestedStatusAlert
        appointment={appointment}
        facility={facilityData}
      />,
      {
        initialState: initialStateVAOSService,
        path: `/requests/${appointment.id}`,
      },
    );
    expect(await screen.baseElement).to.contain('.usa-alert-error');
    expect(screen.baseElement).to.contain.text('You canceled this request');

    expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
  });
});
