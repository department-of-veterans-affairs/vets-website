import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import DetailsVA from '../DetailsVA';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  comment: null,
  vaos: {
    isPendingAppointment: false,
    isUpcomingAppointment: true,
    isVideo: false,
    isPastAppointment: false,
    isCompAndPenAppointment: false,
    isCancellable: false,
    appointmentType: 'vaAppointment',
    isCommunityCare: false,
    isExpressCare: false,
    isPhoneAppointment: false,
    isCOVIDVaccine: false,
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

describe('DetailsVA component with isCompAndPenAppointment', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink]: true,
    },
  };

  it('should display type header', async () => {
    const appointment = {
      ...appointmentData,
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      initialState,
    });

    expect(
      wrapper.getByText('Back to appointments', {
        exact: true,
        selector: 'a',
      }),
    ).to.exist;
  });
});
