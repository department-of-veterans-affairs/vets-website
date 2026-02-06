/* eslint-disable no-plusplus */
// @ts-check
import { format, subDays, subMonths } from 'date-fns';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import PastAppointmentListPageObject from '../../page-objects/AppointmentList/PastAppointmentListPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import AppointmentDetailPageObject from '../../page-objects/AppointmentList/AppointmentDetailPageObject';

describe('VAOS past appointment flow', () => {
  describe('When veteran has past appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles({});
      mockVamcEhrApi();

      cy.login(new MockUser());
    });

    it('should display past appointments list', () => {
      // Arrange
      const yesterday = subDays(new Date(), 1);

      const response = new MockAppointmentResponse({
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
      });

      mockAppointmentsGetApi({ response: [response] });

      // Act
      AppointmentListPageObject.visit();
      cy.findByRole('link', { name: 'Past' })
        .as('link')
        .click();
      cy.get('@link').then(() => {
        // Assert
        // Constrain search within list group.
        cy.findByTestId(
          `appointment-list-${format(yesterday, 'yyyy-MM')}`,
        ).within(() => {
          cy.findAllByTestId('appointment-list-item').should($list => {
            expect($list).to.have.length(1);
          });
        });
      });

      cy.axeCheckBestPractice();
    });

    it('should display past appointment details', () => {
      // Arrange
      const yesterday = subDays(new Date(), 1);
      const response = new MockAppointmentResponse({
        id: '3',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
        past: true,
      });

      mockAppointmentsGetApi({ response: [response] });

      // Act
      PastAppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem()
        .assertLink({ name: /Back to past appointments/i, useShadowDOM: true });

      AppointmentDetailPageObject.assertDaysLeftToFile();

      cy.axeCheckBestPractice();
    });

    it('should display past appointments for selected date range', () => {
      // Arrange
      const response = [3, 6, 9, 12].map(i => {
        return new MockAppointmentResponse({
          id: i,
          cancellable: false,
          localStartTime: subMonths(new Date(), i),
          status: APPOINTMENT_STATUS.booked,
          past: true,
        });
      });

      mockAppointmentsGetApi({ response });

      // Act
      PastAppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectDateRange('2');

      // Assert
      // Constrain search within list group.
      cy.findByTestId(
        `appointment-list-${format(subMonths(new Date(), 6), 'yyyy-MM')}`,
      ).within(() => {
        cy.findAllByTestId('appointment-list-item').should($list => {
          expect($list.length).to.equal(1);
        });
      });

      cy.axeCheckBestPractice();
    });

    it("should display warning when veteran doesn't have any appointments", () => {
      // Act
      mockAppointmentsGetApi({ response: [] });

      // Arrange
      PastAppointmentListPageObject.visit();

      // Assert
      cy.findByText(/You don.t have any appointment requests/i).should('be.ok');
      cy.findByText(/Pending \(0\)/i).should('be.ok');

      cy.axeCheckBestPractice();
    });

    it('should display generic error message', () => {
      // Arrange
      mockAppointmentsGetApi({ response: [], responseCode: 400 });

      // Act
      PastAppointmentListPageObject.visit();

      // Assert
      cy.findByText(/We can’t access your appointments right now/i);
      cy.axeCheckBestPractice();
    });
  });
});
