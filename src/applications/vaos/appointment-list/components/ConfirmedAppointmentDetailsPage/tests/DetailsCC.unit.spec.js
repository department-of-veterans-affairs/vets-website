import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import DetailsCC from '../DetailsCC';

const appointmentData = {
  start: '2024-07-19T08:00:00-07:00',
  version: 2,
  status: 'booked',
  videoData: {
    isVideo: false,
  },
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
  },
  vaos: {
    isCanceled: false,
    isUpcomingAppointment: true,
    isPastAppointment: false,
    isCommunityCare: true,
    apiData: {},
  },
  communityCareProvider: {
    treatmentSpecialty: 'Optometrist',
    providerName: ['John Smith'],
    telecom: [
      {
        system: 'phone',
        value: '703-691-2020',
      },
    ],
    address: {
      postalCode: '22030',
      city: 'FAIRFAX',
      state: 'VA',
      line: ['10640 MAIN ST ; STE 100'],
    },
  },
};

describe('DetailsCC component', () => {
  const initialState = {
    featureToggles: {},
  };

  it('should render the specialty type', async () => {
    // Given the appointment has treatmentSpecialty
    const appointment = {
      ...appointmentData,
    };
    // when featureVaosV2Next flag is on
    const screen = renderWithStoreAndRouter(
      <DetailsCC appointment={appointment} useV2 featureVaosV2Next />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    // it will display the div that contains the data-testid
    expect(screen.getByTestId('appointment-treatment-specialty')).to.exist;
  });
  it('should not render the specialty type', async () => {
    // Given the appointment has treatmentSpecialty
    const appointment = {
      ...appointmentData,
    };
    // when featureVaosV2Next flag is off
    const screen = renderWithStoreAndRouter(
      <DetailsCC appointment={appointment} useV2 featureVaosV2Next={false} />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    // it will not display the div that contains the data-testid
    expect(screen.queryByTestId('appointment-treatment-specialty')).to.be.null;
  });
  it('should render the type of care', async () => {
    // Given the appointment has serviceType
    const appointment = {
      ...appointmentData,
      vaos: {
        ...appointmentData.vaos,
        apiData: { serviceType: 'audiology' },
      },
      communityCareProvider: {
        ...appointmentData.communityCareProvider,
        treatmentSpecialty: null,
      },
    };
    // when useV2 flag is on
    const screen = renderWithStoreAndRouter(
      <DetailsCC appointment={appointment} useV2 featureVaosV2Next />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    // it will display type of care
    expect(screen.getByText('Type of care')).to.exist;
  });
  it('should not render the type of care', async () => {
    // Given the appointment has serviceType
    const appointment = {
      ...appointmentData,
      vaos: {
        ...appointmentData.vaos,
        apiData: { serviceType: 'audiology' },
      },
      communityCareProvider: {
        ...appointmentData.communityCareProvider,
        treatmentSpecialty: null,
      },
    };
    // when useV2 flag is off
    const screen = renderWithStoreAndRouter(
      <DetailsCC appointment={appointment} useV2={false} featureVaosV2Next />,
      {
        initialState,
        path: `/${appointment.id}`,
      },
    );
    // it will not display type of care
    expect(screen.queryByText('Type of care')).to.be.null;
  });
});
