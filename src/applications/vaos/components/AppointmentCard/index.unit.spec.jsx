import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '.';
import AppointmentDateTime from '../../appointment-list/components/AppointmentDateTime';
import { createTestStore } from '../../tests/mocks/setup';

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

describe('VAOS Component: AppointmentCard', () => {
  const initialState = {
    featureToggles: {},
  };

  it('should display appointment card', async () => {
    const state = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
      },
    };

    const store = createTestStore(state);

    const appointment = {
      ...appointmentData,
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard appointment={appointment}>
        <h1 className="vads-u-margin-y--2p5">
          <AppointmentDateTime appointment={appointment} />
        </h1>
      </AppointmentCard>,
      {
        store,
      },
    );

    expect(wrapper.getByTestId('appointment-card')).to.exist;
  });
});
