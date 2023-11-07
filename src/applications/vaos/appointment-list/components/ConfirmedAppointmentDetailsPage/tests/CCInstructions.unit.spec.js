import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import CCInstructions from '../CCInstructions';

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

describe('DetailsVA component', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink]: true,
    },
  };

  it('should render CCInstructions', async () => {
    const appointment = {
      ...appointmentData,
      comment: 'Follow-up/Routine: I have a headache',
    };

    const wrapper = renderWithStoreAndRouter(
      <CCInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    // VAInstructions with upcoming appointment
    expect(await wrapper.findByText('Follow-up/Routine: I have a headache')).to
      .exist;
  });
});
