/* eslint-disable no-plusplus */
// Inteligent code
/// <reference types="cypress" />

import moment from 'moment';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import PendingAppointmentListPageObject from '../../page-objects/AppointmentList/PendingAppointmentListPageObject';
import {
  vaosSetup,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockAppointmentsApi,
  mockVamcEhrApi,
} from '../../vaos-cypress-helpers';
import { MockAppointment } from '../../fixtures/MockAppointment';

describe('VAOS pending appointment flow', () => {
  describe('When veteran has pending appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFacilitiesApi();
      mockFeatureToggles();
      mockLoginApi();
      mockVamcEhrApi();
    });

    it('should display pending appointments list', () => {
      // Arrange
      const response = [];

      for (let i = 1; i <= 5; i++) {
        const appt = new MockAppointment({
          id: i,
          localStartTime: moment(),
          status: APPOINTMENT_STATUS.proposed,
        });
        response.push(appt);
      }
      mockAppointmentsApi({ response });

      // Act
      PendingAppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 5,
      });

      // Assert
      cy.findByText(/Pending \(5\)/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it('should display pending appointment details', () => {
      // Arrange
      const appt = new MockAppointment({
        localStartTime: moment(),
        serviceType: 'primaryCare',
        status: APPOINTMENT_STATUS.proposed,
      });

      mockAppointmentsApi({ response: [appt] });

      // Act
      PendingAppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 1,
      });
      cy.findByText(/Primary care/i).click({ waitForAnimations: true });

      // Assert
      cy.findByText(/Pending \(1\)/i).should('be.ok');
      cy.findByText(/Pending primary care appointment/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it("should display warning when veteran doesn't have any appointments", () => {
      // Act
      mockAppointmentsApi({ response: [] });

      // Arrange
      PendingAppointmentListPageObject.visit();

      // Assert
      cy.findByText(/You don.t have any appointment requests/i).should('be.ok');
      cy.findByText(/Pending \(0\)/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it('should display generic error message', () => {
      // Arrange
      mockAppointmentsApi({ response: [], responseCode: 400 });

      // Act
      PendingAppointmentListPageObject.visit();

      // Assert
      cy.findByText(/We.re sorry\. We.ve run into a problem/i);
      cy.axeCheckBestPractice();
    });
  });
});
