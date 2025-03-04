import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCardIcon from './AppointmentCardIcon';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  version: 2,
  status: 'booked',
  vaos: {
    isCanceled: false,
    isUpcomingAppointment: true,
    isPastAppointment: false,
    isCommunityCare: false,
    isPhoneAppointment: false,
    isCompAndPenAppointment: false,
    isVideo: false,
    isCOVIDVaccine: false,
    apiData: {},
  },
};

describe('VAOS Component: AppointmentCardIcon', () => {
  const initialState = {
    featureToggles: {},
  };

  it('should display location_city icon for VA in-person appointments', async () => {
    const appointment = {
      ...appointmentData,
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCardIcon appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(wrapper.getByTestId('appointment-icon')).to.exist;
    expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
      'icon',
      'location_city',
    );
  });

  it('should display location_city icon for VA in-person vaccine appointments', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isCOVIDVaccine: true,
      },
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCardIcon appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(wrapper.getByTestId('appointment-icon')).to.exist;
    expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
      'icon',
      'location_city',
    );
  });

  it(
    'should display location_city icon for VA video care at a VA location appointments',
    async () => {
      const appointment = {
        ...appointmentData,
        vaos: {
          isVideo: true,
        },
        videoData: {
          isAtlas: false,
          kind: 'CLINIC_BASED',
          extension: {
            patientHasMobileGfe: false,
          },
        },
      };

      const wrapper = renderWithStoreAndRouter(
        <AppointmentCardIcon appointment={appointment} />,
        {
          initialState,
        },
      );

      expect(wrapper.getByTestId('appointment-icon')).to.exist;
      expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
        'icon',
        'location_city',
      );
    },
    async () => {
      const appointment = {
        ...appointmentData,
        vaos: {
          isVideo: true,
        },
        videoData: {
          isAtlas: false,
          kind: 'STORE_FORWARD',
          extension: {
            patientHasMobileGfe: false,
          },
        },
      };

      const wrapper = renderWithStoreAndRouter(
        <AppointmentCardIcon appointment={appointment} />,
        {
          initialState,
        },
      );

      expect(wrapper.getByTestId('appointment-icon')).to.exist;
      expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
        'icon',
        'location_city',
      );
    },
  );

  it('should display location_city icon for claim exam appointment', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isCompAndPenAppointment: true,
      },
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCardIcon appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(wrapper.getByTestId('appointment-icon')).to.exist;
    expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
      'icon',
      'location_city',
    );
  });

  it('should display location_city icon for VA video care at ATLAS location appointments', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isVideo: true,
      },
      videoData: {
        isAtlas: true,
      },
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCardIcon appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(wrapper.getByTestId('appointment-icon')).to.exist;
    expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
      'icon',
      'location_city',
    );
  });

  it('should display calendar_today icon for community care appointment appointments', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isCommunityCare: true,
      },
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCardIcon appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(wrapper.getByTestId('appointment-icon')).to.exist;
    expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
      'icon',
      'calendar_today',
    );
  });

  it(
    'should display videocam icon for VA video care at a home appointments',
    async () => {
      const appointment = {
        ...appointmentData,
        vaos: {
          isVideo: true,
        },
        videoData: {
          isAtlas: false,
          kind: 'MOBILE_ANY',
          extension: {
            patientHasMobileGfe: false,
          },
        },
      };

      const wrapper = renderWithStoreAndRouter(
        <AppointmentCardIcon appointment={appointment} />,
        {
          initialState,
        },
      );

      expect(wrapper.getByTestId('appointment-icon')).to.exist;
      expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
        'icon',
        'videocam',
      );
    },
    async () => {
      const appointment = {
        ...appointmentData,
        vaos: {
          isVideo: true,
        },
        videoData: {
          isAtlas: false,
          kind: 'ADHOC',
          extension: {
            patientHasMobileGfe: false,
          },
        },
      };

      const wrapper = renderWithStoreAndRouter(
        <AppointmentCardIcon appointment={appointment} />,
        {
          initialState,
        },
      );

      expect(wrapper.getByTestId('appointment-icon')).to.exist;
      expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
        'icon',
        'videocam',
      );
    },
  );

  it('should display phone icon for VA phone appointments', async () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isPhoneAppointment: true,
      },
    };

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCardIcon appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(wrapper.getByTestId('appointment-icon')).to.exist;
    expect(wrapper.getByTestId('appointment-icon')).to.have.attribute(
      'icon',
      'phone',
    );
  });
});
