import { expect } from 'chai';
import { subDays } from 'date-fns';
import React from 'react';
import { MockAppointment } from '../../tests/fixtures/MockAppointment';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import MockFacility from '../../tests/fixtures/MockFacility';
import MockTravelPayClaim from '../../tests/fixtures/MockTravelPayClaim';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../utils/constants';
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
      const appointment = new MockAppointment()
        .setApiData(
          new MockAppointmentResponse({
            localStartTime: subDays(new Date(), 1),
          }).setTravelPayClaim(new MockTravelPayClaim()),
        )
        .setIsInPersonVisit(true)
        .setIsPastAppointment(true)
        .setLocation(new MockFacility());
      appointment.start = subDays(new Date(), 1);
      // Act
      const screen = renderWithStoreAndRouter(
        <DetailPageLayout data={appointment} facility={facilityData} />,
        {
          store,
          initialState,
        },
      );
      expect(screen.baseElement).to.contain.text('Appointment tasks');
      expect(screen.baseElement).to.contain.text('After-visit summary');
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
      const appointment = new MockAppointment({
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setApiData(
          new MockAppointmentResponse({
            localStartTime: subDays(new Date(), 1),
            status: APPOINTMENT_STATUS.cancelled,
          }).setTravelPayClaim(new MockTravelPayClaim()),
        )
        .setIsInPersonVisit(true)
        .setIsPastAppointment(true)
        .setLocation(new MockFacility());
      appointment.start = subDays(new Date(), 1);
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
