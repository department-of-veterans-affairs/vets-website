import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import DetailPageLayout from './DetailPageLayout';

describe('VAOS Component: DetailPageLayout', () => {
  const facilityData = {};
  const initialState = {
    featureToggles: {
      travelPayViewClaimDetails: true,
      travelPaySubmitMileageExpense: true,
    },
  };

  describe('When viewing past appt, travelPayViewClaimDetails = true', () => {
    it('should display appointment task and travel reimbursement info', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const tomorrow = moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DDTHH:mm:ss');
      const appointment = {
        id: '123',
        start: tomorrow,
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
        },
        videoData: {},
        vaos: {
          isPastAppointment: true,
          isCancellable: true,
          apiData: {
            travelPayClaim: {
              metadata: {
                status: 200,
                message: 'No claims found.',
                success: true,
              },
            },
            localStartTime: tomorrow,
            serviceType: 'primaryCare',
          },
        },
        status: 'booked',
        isPastAppointment: true,
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <DetailPageLayout data={appointment} facility={facilityData} />,
        {
          store,
          initialState,
        },
      );
      expect(screen.baseElement).to.contain.text('Appointment tasks');
      expect(screen.baseElement).to.contain.text('After visit summary');
      expect(screen.baseElement).to.contain.text('Travel reimbursement');
      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });
  describe('When viewing cancel appt, travelPayViewClaimDetails = true', () => {
    it('should not display appointment task and travel reimbursement info', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const tomorrow = moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DDTHH:mm:ss');
      const appointment = {
        id: '123',
        start: tomorrow,
        location: {
          stationId: '983',
          clinicName: 'Clinic 1',
          clinicPhysicalLocation: 'CHEYENNE',
          clinicPhone: '500-500-5000',
          clinicPhoneExtension: '1234',
        },
        videoData: {},
        vaos: {
          isPastAppointment: true,
          isCancellable: true,
          apiData: {
            travelPayClaim: {
              metadata: {
                status: 200,
                message: 'No claims found.',
                success: true,
              },
            },
            localStartTime: tomorrow,
            serviceType: 'primaryCare',
          },
        },
        status: 'cancelled',
        isPastAppointment: true,
      };

      // Act
      const screen = renderWithStoreAndRouter(
        <DetailPageLayout data={appointment} facility={facilityData} />,
        {
          store,
          initialState,
        },
      );
      expect(screen.baseElement).to.contain.text(
        'Facility canceled this appointment',
      );
      expect(screen.baseElement).to.not.contain.text('Appointment tasks');
      expect(screen.baseElement).to.not.contain.text('After visit summary');
      expect(screen.baseElement).to.not.contain.text('Travel reimbursement');

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });
});
