import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import ConfirmedAppointmentDetailsPage from '../index';
import { Toggler } from '~/platform/utilities/feature-toggles';
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

describe('ConfirmedAppointmentDetailsPage component', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate]: true,
    },
  };

  it('should render DetailsVideo component', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(
      <ConfirmedAppointmentDetailsPage {...props} />,
      {
        initialState,
      },
    );

    // DetailsVideo with past appointment
    expect(await wrapper.findByText('This appointment occurred in the past.'))
      .to.exist;
  });

  it('should render correct pageTitleSuffix when vaOnlineSchedulingBreadcrumbUrlUpdate is on', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(
      <ConfirmedAppointmentDetailsPage {...props} />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText('This appointment occurred in the past.'))
      .to.exist;
  });
});
