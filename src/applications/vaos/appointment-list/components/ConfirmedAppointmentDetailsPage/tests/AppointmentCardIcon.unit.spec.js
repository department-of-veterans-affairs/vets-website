import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCardIcon from '../AppointmentCardIcon';

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

describe('VAOS Component: AppointmentCardIcon', () => {
  describe('When the vaOnlineSchedulingAppointmentDetailsRedesign feature flag is on', () => {
    const initialState = {
      featureToggles: {},
    };

    it('should display location_city icon for VA In-person appointments', async () => {
      // Given the appointment has treatmentSpecialty
      const appointment = {
        ...appointmentData,
      };
      // when featureVaosV2Next flag is on
      const screen = renderWithStoreAndRouter(
        <AppointmentCardIcon appointment={appointment} />,
        {
          initialState,
          path: `/${appointment.id}`,
        },
      );
      // it will display the div that contains the data-testid
      expect(screen.getByTestId('appointment-treatment-specialty')).to.exist;
    });

    it('should display location_city icon for VA In-person vaccine appointments', async () => {});

    it('should display location_city icon for VA video care at a VA location appointments', async () => {});

    it('should display location_city icon for claim exam appointment', async () => {});

    it('should display location_city icon for VA video care at ATLAS location appointments', async () => {});

    it('should display calendar_today icon for community care appointment appointments', async () => {});

    it('should display videocam icon for VA video care at a home appointments', async () => {});

    it('should display videocam icon for VA video care on GFE appointments', async () => {});

    it('should display phone icon for VA phone appointments', async () => {});
  });
});
