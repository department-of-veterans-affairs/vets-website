import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AtlasLocation from '../AtlasLocation';
import { AtlasAppoinment } from '../../../../tests/mocks/unit-test-helpers';

describe('VAOS Component: AtlasLocation', () => {
  const initialState = {
    featureToggles: {},
  };
  const atlasAppointment = new AtlasAppoinment();

  const appointmentData = {
    status: 'booked',
    vaos: {
      isPastAppointment: false,
    },
  };

  it('should display Atlas location information', async () => {
    const appointment = {
      ...appointmentData,
      ...atlasAppointment,
    };

    const screen = render(
      <AtlasLocation
        appointment={appointment}
        isPast={appointment.vaos.isPastAppointment}
      />,
      {
        initialState,
      },
    );
    // instructions
    expect(
      await screen.findByText(
        'You will use this code to find your appointment using the computer provided at the site.',
      ),
    ).to.exist;
    // shows the code
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: 'Appointment code: 7VBBCA',
      }),
    ).to.exist;
    // shows address
    expect(screen.baseElement).to.contain.text('114 Dewey Ave');
  });
  it('should not display Atlas instructions if past appointment', async () => {
    const appointment = {
      ...appointmentData,
      ...atlasAppointment,
      vaos: {
        isPastAppointment: true,
      },
    };

    const screen = render(
      <AtlasLocation
        appointment={appointment}
        isPast={appointment.vaos.isPastAppointment}
      />,
      {
        initialState,
      },
    );
    expect(
      await screen.queryByText(
        'You will use this code to find your appointment using the computer provided at the site.',
      ),
    ).to.be.null;
  });
});
