/* eslint-disable no-plusplus */
// @ts-check
import { subDays } from 'date-fns';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockUser from '../../../fixtures/MockUser';
import PendingAppointmentListPageObject from '../../page-objects/AppointmentList/PendingAppointmentListPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('VAOS pending appointment flow', () => {
  describe('When veteran has pending appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should display pending appointments list', () => {
      // Arrange
      const response = [];

      for (let i = 1; i <= 5; i++) {
        const appt = new MockAppointmentResponse({
          id: i,
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.proposed,
          pending: true,
        });
        response.push(appt);
      }
      mockAppointmentsGetApi({ response });

      // Act
      cy.login(new MockUser());

      PendingAppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 5,
      });

      // Assert
      cy.findByText(/Pending \(5\)/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it('should display pending appointment details', () => {
      // Arrange
      const appt = new MockAppointmentResponse({
        localStartTime: new Date(),
        serviceType: 'primaryCare',
        status: APPOINTMENT_STATUS.proposed,
        pending: true,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      cy.login(new MockUser());

      PendingAppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 1,
      });
      cy.findByText(/Primary care/i).click({ waitForAnimations: true });

      // Assert
      cy.findByText(/Pending \(1\)/i).should('be.ok');
      cy.findByText(/Pending primary care appointment/i).should('be.ok');
      cy.findByText(/You requested this appointment/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it('should display pending appointment pass due alert', () => {
      // Arrange
      const past = subDays(new Date(), 7);
      const appt = new MockAppointmentResponse({
        localStartTime: new Date(),
        serviceType: 'primaryCare',
        status: APPOINTMENT_STATUS.proposed,
        created: past,
        pending: true,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      cy.login(new MockUser());

      PendingAppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 1,
      });
      cy.findByText(/Primary care/i).click({ waitForAnimations: true });

      // Assert
      cy.findByText(/Pending \(1\)/i).should('be.ok');
      cy.findByText(/Pending primary care appointment/i).should('be.ok');
      cy.get('va-alert[status=warning]')
        .as('alert')
        .shadow();
      cy.get('@alert').contains(
        /We're having trouble scheduling this appointment/i,
      );

      cy.axeCheckBestPractice();
    });

    it("should display warning when veteran doesn't have any appointments", () => {
      // Act
      mockAppointmentsGetApi({ response: [] });

      // Arrange
      cy.login(new MockUser());

      PendingAppointmentListPageObject.visit();

      // Assert
      cy.findByText(/You don.t have any appointment requests/i).should('be.ok');
      cy.findByText(/Pending \(0\)/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it('should display generic error message', () => {
      // Arrange
      mockAppointmentsGetApi({ response: [], responseCode: 400 });

      // Act
      cy.login(new MockUser());

      PendingAppointmentListPageObject.visit();

      // Assert
      cy.findByText(/We.re sorry\. We.ve run into a problem/i);
      cy.axeCheckBestPractice();
    });
  });
});
