import React from 'react';
import { expect } from 'chai';

import sinon from 'sinon';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '../AppointmentCard';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  id: '1234',
  vaos: {
    isVideo: true,
    isPastAppointment: true,
    isCommunityCare: true,
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
  const initialState = {
    featureToggles: {
      featureStatusImprovement: true,
    },
  };

  it('should return at an ATLAS location as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: true,
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at an ATLAS location/i))
      .to.exist;
  });

  it('should return at a VA location as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'CLINIC_BASED',
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at a VA location/i)).to
      .exist;
  });
  it('should return using a VA device as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: true,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect using a VA device/i)).to
      .exist;
  });
  it('should return at home as VideoAppointmentDescription', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/VA Video Connect at home/i)).to.exist;
  });

  it('should return at CommunityCareProvider with Provider Name', async () => {
    const appointment = {
      ...appointmentData,
      communityCareProvider: {
        providerName: 'Dr. Smith',
      },
      version: 1,
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/Dr. Smith/i)).to.exist;
  });

  it('should return at CommunityCareProvider with Practice Name', async () => {
    const appointment = {
      ...appointmentData,
      communityCareProvider: {
        providerName: 'Dr. Smith',
        practiceName: 'Test Practice',
        name: 'Test',
      },
      videoData: {
        isAtlas: false,
        kind: 'MOBILE_ANY',
        extension: {
          patientHasMobileGfe: false,
        },
      },
    };

    const handleClick = sinon.spy();
    const handleKeyDown = sinon.spy();

    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />,
      {
        initialState,
      },
    );

    expect(await wrapper.findByText(/Dr. Smith/i)).to.exist;
  });
});
