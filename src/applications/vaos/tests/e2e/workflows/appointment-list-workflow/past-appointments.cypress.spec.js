/* eslint-disable no-plusplus */
// @ts-check
import moment from 'moment';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import PastAppointmentListPageObject from '../../page-objects/AppointmentList/PastAppointmentListPageObject';
import MockUser from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';

describe('VAOS past appointment flow', () => {
  describe('When veteran has past appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();

      cy.login(new MockUser());
    });

    it('should display past appointments list', () => {
      // Arrange
      const yesterday = moment().subtract(1, 'day');

      const response = new MockAppointmentResponse({
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
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
          `appointment-list-${yesterday.format('YYYY-MM')}`,
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
      const yesterday = moment().subtract(1, 'day');
      const response = new MockAppointmentResponse({
        id: '3',
        cancellable: false,
        localStartTime: yesterday,
        status: APPOINTMENT_STATUS.booked,
      });

      mockAppointmentsGetApi({ response: [response] });

      // Act
      PastAppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      const timestamp = new RegExp(
        `${yesterday.format('dddd, MMMM D, YYYY [at] h:mm')}`,
      );
      cy.findByText(timestamp).should('exist');

      cy.axeCheckBestPractice();
    });

    it('should display past appointments for selected date range', () => {
      // Arrange
      const response = [3, 6, 9, 12].map(i => {
        return new MockAppointmentResponse({
          id: i,
          cancellable: false,
          localStartTime: moment().subtract(i, 'month'),
          status: APPOINTMENT_STATUS.booked,
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
        `appointment-list-${moment()
          .subtract(6, 'month')
          .format('YYYY-MM')}`,
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
      cy.findByText(/We.re sorry\. We.ve run into a problem/i);
      cy.axeCheckBestPractice();
    });
  });
});
