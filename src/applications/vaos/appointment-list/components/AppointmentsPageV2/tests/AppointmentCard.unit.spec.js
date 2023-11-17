import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '../AppointmentCard';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  vaos: {
    isPastAppointment: true,
  },
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
};
const facilityData = new Facility();

describe('AppointmentCard component', () => {
  const initialState = { featureToggles: {} };

  it('should render comment in AppointmentCard', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: true },
        kind: 'MOBILE_ANY',
      },
      vaos: {
        isPastAppointment: true,
      },
    };

    const props = { appointment, facilityData };
    const wrapper = renderWithStoreAndRouter(<AppointmentCard {...props} />, {
      initialState,
    });

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.null;
  });
});
