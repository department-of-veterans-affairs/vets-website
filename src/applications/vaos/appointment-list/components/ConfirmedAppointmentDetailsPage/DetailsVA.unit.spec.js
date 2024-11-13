import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import DetailsVA from './DetailsVA';
import { Facility } from '../../../tests/mocks/unit-test-helpers';
import { createTestStore } from '../../../tests/mocks/setup';

const facilityData = new Facility();

describe('VAOS Component: DetailsVA', () => {
  const initialState = {
    featureToggles: {},
  };

  describe('When not canceling an appointment', () => {
    it('should display comp and pension appointment layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: true,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          apiData: {
            serviceCategory: [
              {
                text: 'COMPENSATION & PENSION',
              },
            ],
          },
        },
        status: 'booked',
      };

      // Act
      const props = { appointment, facilityData };
      const screen = renderWithStoreAndRouter(<DetailsVA {...props} />, {
        store,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /Claim exam/i,
        }),
      ).to.be.ok;
    });

    it('should display phone appointment layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isPhoneAppointment: true,
          isCancellable: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const props = { appointment, facilityData };
      const screen = renderWithStoreAndRouter(<DetailsVA {...props} />, {
        store,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /Phone appointment/i,
        }),
      ).to.be.ok;
    });

    it('should display in-person appointment layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const appointment = {
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCancellable: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      // Act
      const props = { appointment, facilityData };
      const screen = renderWithStoreAndRouter(<DetailsVA {...props} />, {
        store,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /In-person appointment/i,
        }),
      ).to.be.ok;
    });
  });

  describe('When canceling an appointment', () => {
    it('should display cancel warning page', async () => {
      // Arrange
      const appointment = {
        id: '1',
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCancellable: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      const store = createTestStore({
        appointments: {
          appointmentToCancel: null,
          showCancelModal: true,
          cancelAppointmentStatus: 'notStarted',

          confirmed: [appointment],
          appointmentDetails: {},
        },
      });

      // Act
      const props = { appointment, facilityData };
      const screen = renderWithStoreAndRouter(<DetailsVA {...props} />, {
        store,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /Would you like to cancel this appointment/i,
        }),
      ).to.be.ok;
    });

    it('should display cancel confirmation page', async () => {
      // Arrange
      const appointment = {
        id: '1',
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCancellable: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      const store = createTestStore({
        appointments: {
          appointmentToCancel: null,
          showCancelModal: true,
          cancelAppointmentStatus: 'succeeded',

          confirmed: [appointment],
          appointmentDetails: {},
        },
      });

      // Act
      const props = { appointment, facilityData };
      const screen = renderWithStoreAndRouter(<DetailsVA {...props} />, {
        store,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /You have canceled your appointment/i,
        }),
      ).to.be.ok;
    });

    it('should display cancel alert page on failure', async () => {
      // Arrange
      const appointment = {
        id: '1',
        location: {},
        videoData: {},
        vaos: {
          isCommunityCare: false,
          isCompAndPenAppointment: false,
          isCOVIDVaccine: false,
          isPendingAppointment: false,
          isUpcomingAppointment: true,
          isCancellable: true,
          apiData: {
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
      };

      const store = createTestStore({
        appointments: {
          appointmentToCancel: null,
          showCancelModal: true,
          cancelAppointmentStatus: 'failed',

          confirmed: [appointment],
          appointmentDetails: {},
        },
      });

      // Act
      const props = { appointment, facilityData };
      const screen = renderWithStoreAndRouter(<DetailsVA {...props} />, {
        store,
      });

      // Assert
      expect(
        await screen.findByRole('heading', {
          level: 2,
          name: /We couldn.t cancel your appointment/i,
        }),
      ).to.be.ok;
    });
  });
});
