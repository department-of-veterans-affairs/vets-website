import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCardIcon from '../AppointmentCardIcon';

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

  it('should display fa-building icon for VA in-person appointments', async () => {
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
    expect(wrapper.baseElement).to.contain('.fa-building');
  });

  it('should display fa-building icon for VA in-person vaccine appointments', async () => {
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
    expect(wrapper.baseElement).to.contain('.fa-building');
  });

  it(
    'should display fa-building icon for VA video care at a VA location appointments',
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
      expect(wrapper.baseElement).to.contain('.fa-building');
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
      expect(wrapper.baseElement).to.contain('.fa-building');
    },
  );

  it('should display fa-building icon for claim exam appointment', async () => {
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
    expect(wrapper.baseElement).to.contain('.fa-building');
  });

  it('should display fa-building icon for VA video care at ATLAS location appointments', async () => {
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
    expect(wrapper.baseElement).to.contain('.fa-building');
  });

  it('should display fa-calendar icon for community care appointment appointments', async () => {
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
    expect(wrapper.baseElement).to.contain('.fa-calendar');
  });

  it.skip(
    'should display fa-video icon for VA video care at a home appointments',
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
      expect(wrapper.baseElement).to.contain('.fa-video');
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
      expect(wrapper.baseElement).to.contain('.fa-video');
    },
  );

  // Will re-enable once video appointment content is updated
  it.skip(
    'should display fa-video icon for VA video care on GFE appointments',
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
            patientHasMobileGfe: true,
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
      expect(wrapper.baseElement).to.contain('.fa-video');
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
            patientHasMobileGfe: true,
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
      expect(wrapper.baseElement).to.contain('.fa-video');
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
    expect(wrapper.baseElement).to.contain('.fa-phone-alt');
  });
});
