import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import DetailsVA from '../DetailsVA';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';
import { createTestStore } from '../../../../tests/mocks/setup';

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

describe('VAOS Component: DetailsVA', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingAppointmentDetailsRedesign: false,
    },
  };

  it('should not display type of care header for upcoming C&P appointments', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
      vaos: {
        ...appointmentData.vaos,
        isCompAndPenAppointment: true,
        apiData: { serviceType: 'audiology' },
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    expect(wrapper.queryByText(/Type of care:/i)).not.to.exist;
  });

  it('should display type of care for past C&P appointments', async () => {
    const store = createTestStore(initialState);
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
      store,
    });

    expect(
      wrapper.getByText('Audiology and speech', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
  });

  it('should render StatusAlert', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
      vaos: {
        isUpcomingAppointment: false,
        isPastAppointment: true,
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    // StatusAlert with past appointment
    expect(await wrapper.findByText('This appointment occurred in the past.'))
      .to.exist;
  });

  it('should render VAFacilityLocation', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    // VAFacilityLocation with upcoming appointment
    expect(await wrapper.findByText('View facility information')).to.exist;
  });

  it('should render VAInstructions', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
      comment: 'Follow-up/Routine: I have a headache',
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    // VAInstructions with upcoming appointment
    expect(await wrapper.findByText('Follow-up/Routine: I have a headache')).to
      .exist;
  });

  it('should render CalendarLink', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    // CalendarLink with upcoming appointment, it's a va-link web component
    // so use data - testid to locate
    expect(await wrapper.findByTestId('add-to-calendar-link')).to.exist;
  });

  it('should render NoOnlineCancelAlert', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
      vaos: {
        ...appointmentData.vaos,
        isCancellable: false,
      },
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    // NoOnlineCancelAlert with upcoming appointment
    expect(
      await wrapper.findByText(
        'To reschedule or cancel this appointment, contact the VA facility where you scheduled it.',
      ),
    ).to.exist;
  });

  it('should render PrintLink', async () => {
    const store = createTestStore(initialState);
    const appointment = {
      ...appointmentData,
    };

    const props = { appointment, facilityData };

    const wrapper = renderWithStoreAndRouter(<DetailsVA {...props} />, {
      store,
    });

    // PrintLink with upcoming appointment
    expect(await wrapper.findByText('Print')).to.exist;
  });
});
