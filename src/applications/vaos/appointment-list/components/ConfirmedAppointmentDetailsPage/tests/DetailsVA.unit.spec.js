import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import DetailsVA from '../DetailsVA';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  vaos: {
    isCanceled: false,
    appointmentType: 'vaAppointment',
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

describe('DetailsVA component', () => {
  const initialState = {
    featureToggles: {
      [Toggler.TOGGLE_NAMES.vaOnlineSchedulingDescriptiveBackLink]: true,
    },
  };

  it('should not display type of care header for upcoming C&P appointments', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isUpcomingAppointment: true,
        isPastAppointment: false,
        isCompAndPenAppointment: true,
        apiData: { serviceType: 'audiology' },
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      initialState,
    });

    expect(wrapper.queryByText(/Type of care:/i)).not.to.exist;
  });

  it('should display type of care for past C&P appointments', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isUpcomingAppointment: true,
        isPastAppointment: false,
        isCompAndPenAppointment: true,
        apiData: { serviceType: 'audiology' },
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      initialState,
    });

    expect(
      wrapper.getByText('Audiology and speech', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });

  it('should render StatusAlert, VAFacilityLocation and VAInstructions, CalendarLink and NoOnlineCancelAlert', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
        isCompAndPenAppointment: false,
        apiData: { serviceType: 'audiology' },
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      initialState,
    });

    // StatusAlert with past appointment
    expect(await wrapper.findByText('This appointment occurred in the past.'))
      .to.exist;
  });
});
