import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import CCInstructions from '../CCInstructions';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
};

describe('CCInstructions component', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink]: true,
    },
  };

  it('should render comment in CCInstructions', async () => {
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

    // CCInstructions with comment
    expect(await wrapper.findByText('Follow-up/Routine: I have a headache')).to
      .exist;
  });

  it('should not render comment in CCInstructions', async () => {
    const appointment = {
      ...appointmentData,
      comment: '',
    };

    const wrapper = renderWithStoreAndRouter(
      <CCInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    // CCInstructions with no comment
    expect(await wrapper).to.exist;
  });
});
