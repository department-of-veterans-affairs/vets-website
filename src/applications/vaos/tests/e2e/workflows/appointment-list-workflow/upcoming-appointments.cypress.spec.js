/* eslint-disable no-plusplus */
// @ts-check
import moment from 'moment';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockLoginApi,
  mockAppointmentUpdateApi,
  vaosSetup,
  mockVamcEhrApi,
} from '../../vaos-cypress-helpers';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_VISIT_ID,
  VIDEO_TYPES,
} from '../../../../utils/constants';

describe('VAOS upcoming appointment flow', () => {
  describe('When veteran has upcoming appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockLoginApi();
      mockVamcEhrApi();
    });

    it('should display upcoming appointments list', () => {
      // Arrange
      const vaAppt = new MockAppointment({
        id: '1',
        localStartTime: moment(),
      });

      const ccAppt = new MockAppointment({
        id: '2',
        kind: 'cc',
        localStartTime: moment().add(1, 'day'),
      });

      const phoneAppt = new MockAppointment({
        id: '3',
        kind: TYPE_OF_VISIT_ID.phone,
        localStartTime: moment().add(1, 'day'),
      });

      const atlasVideoAppt = new MockAppointment({
        id: '4',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(2, 'day'),
        atlas: {
          confirmationCode: '7VBBCA',
          address: {
            streetAddress: '114 Dewey Ave',
            city: 'Eureka',
            state: 'MT',
            zipCode: '59917',
          },
        },
        vvsKind: VIDEO_TYPES.adhoc,
      });

      const clinicVideoAppt = new MockAppointment({
        id: '5',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(2, 'day'),
        vvsKind: VIDEO_TYPES.clinic,
      });

      const storeForwardVideoAppt = new MockAppointment({
        id: '6',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(2, 'day'),
        vvsKind: VIDEO_TYPES.storeForward,
      });

      const gfeVideoAppt = new MockAppointment({
        id: '7',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(2, 'day'),
        vvsKind: VIDEO_TYPES.mobile,
        patientHasMobileGfe: true,
      });

      const mobileVideoAppt = new MockAppointment({
        id: '8',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment()
          .add(3, 'day')
          .subtract(60, 'minutes'),
        vvsKind: VIDEO_TYPES.mobile,
      });

      const response = [
        vaAppt,
        ccAppt,
        phoneAppt,
        atlasVideoAppt,
        clinicVideoAppt,
        storeForwardVideoAppt,
        gfeVideoAppt,
        mobileVideoAppt,
      ];

      mockAppointmentsGetApi({ response });

      // Act
      AppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 8,
      });

      // Assert
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for CC appointment', () => {
      // Arrange
      const today = moment();
      const appt = new MockAppointment({
        kind: 'cc',
        localStartTime: today,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      const timestamp = new RegExp(
        `${today.format('dddd, MMMM D, YYYY [at] h:mm')}`,
      );
      cy.findByText(timestamp).should('exist');
      cy.findByText(/Community care provider/i).should('exist');
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for VA video appointment', () => {
      // Arrange
      const appt = new MockAppointment({
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment(),
        vvsKind: VIDEO_TYPES.clinic,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect at VA location/i).should('exist');
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for Atlas video appointment ', () => {
      // Arrange
      const appt = new MockAppointment({
        id: '4',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(1, 'day'),
        atlas: {
          confirmationCode: '7VBBCA',
          address: {
            streetAddress: '114 Dewey Ave',
            city: 'Eureka',
            state: 'MT',
            zipCode: '59917',
          },
        },
        vvsKind: VIDEO_TYPES.adhoc,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect at an ATLAS location/i);
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for GFE video appointment.', () => {
      // Arrange
      const appt = new MockAppointment({
        id: '7',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(2, 'day'),
        vvsKind: VIDEO_TYPES.mobile,
        patientHasMobileGfe: true,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect using VA device/i);
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for HOME video appointment ', () => {
      // Arrange
      const appt = new MockAppointment({
        id: '8',
        kind: TYPE_OF_VISIT_ID.telehealth,
        localStartTime: moment().add(32, 'minutes'),
        vvsKind: VIDEO_TYPES.mobile,
      });

      mockAppointmentsGetApi({ response: [appt] });

      // Act
      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect at home/i);
      cy.axeCheckBestPractice();
    });

    it("should display warning when veteran doesn't have any appointments", () => {
      // Arrange
      mockAppointmentsGetApi({ response: [] });

      // Act
      AppointmentListPageObject.visit().assertNoAppointments();

      // Assert
      cy.axeCheckBestPractice();
    });

    it('should display generic error message', () => {
      // Arrange
      mockAppointmentsGetApi({ response: [], responseCode: 400 });

      // Act
      AppointmentListPageObject.visit();

      // Assert
      cy.findByText(/We.re sorry\. We.ve run into a problem/i);
      cy.axeCheckBestPractice();
    });

    it('should alow veteran to cancel appointment', () => {
      // Arrange
      const appt = new MockAppointment({
        cancellable: true,
        localStartTime: moment(),
      });

      const canceledAppt = {
        ...appt,
        attributes: {
          ...appt.attributes,
          status: 'cancelled',
          cancelationReason: {
            coding: [
              {
                code: 'pat',
              },
            ],
          },
        },
      };

      mockAppointmentsGetApi({ response: [appt] });
      mockAppointmentUpdateApi({ response: canceledAppt });

      // Act
      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/Cancel appointment/i)
        .should('exist')
        .click({ waitForAnimations: true });

      cy.get('#cancelAppt').shadow();
      cy.findByText(/Yes, cancel this appointment/i)
        .should('exist')
        .click({
          waitForAnimations: true,
        });

      cy.get('#cancelAppt')
        .shadow()
        .find('h1')
        .should('be.visible')
        .and('contain', 'Your appointment has been canceled');
      cy.findByText(/Continue/i)
        .should('exist')
        .click();

      cy.findByText(/You canceled your appointment/i);

      cy.axeCheckBestPractice();
    });

    it('should display layout correctly for single appointment - same month, different day', () => {
      // Arrange
      const today = moment();
      const response = [];

      for (let i = 1; i <= 2; i++) {
        const appt = new MockAppointment({
          id: i,
          cancellable: false,
          localStartTime: moment(today).add(i, 'day'),
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }
      mockAppointmentsGetApi({ response });

      // Act
      AppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 2,
      });

      // Assert
      cy.findAllByTestId('appointment-list-item').should($list => {
        expect($list).to.have.length(2);
      });

      // Constrain search within list group.
      const tomorrow = moment(today).add(1, 'day');
      const dayAfterTomorrow = moment(today).add(2, 'days');
      cy.findByTestId(`appointment-list-${tomorrow.format('YYYY-MM')}`).within(
        () => {
          // Expect date and day to be dislayed
          cy.findByText(tomorrow.format('ddd')).should('be.ok');
          cy.findByText(dayAfterTomorrow.format('ddd')).should('be.ok');
        },
      );

      cy.axeCheckBestPractice();
    });

    it('should display layout correctly for multiply appointments - same month, different day', () => {
      // Arrange
      const today = moment();
      const tomorrow = moment().add(1, 'day');
      const response = [];

      for (let i = 1; i <= 4; i++) {
        const appt = new MockAppointment({
          id: i,
          cancellable: false,
          localStartTime: i <= 2 ? today : tomorrow,
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }

      mockAppointmentsGetApi({ response });

      // Act
      AppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 4,
      });

      // Assert
      cy.findAllByTestId('appointment-list-item').should($list => {
        expect($list).to.have.length(4);
      });

      // Constrain search within list group.
      cy.findByTestId(`${today.format('YYYY-MM-DD')}-group`).within(() => {
        cy.findAllByText(`${today.format('ddd')}`).should($span => {
          // Expect 1st row to display date and day
          expect($span.first()).to.be.visible;

          // Expect all other rows not to display date and day
          expect($span.last()).to.be.hidden;
        });
      });

      cy.axeCheckBestPractice();
    });

    it('should display layout correctly form multiply appointments - same month, same day', () => {
      // Arrange
      const today = moment();
      const response = [];

      for (let i = 1; i <= 2; i++) {
        const appt = new MockAppointment({
          id: i,
          cancellable: false,
          localStartTime: today,
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }
      mockAppointmentsGetApi({ response });

      // Act
      AppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 2,
      });

      // Assert
      // Constrain search within list group.
      cy.findByTestId(`${today.format('YYYY-MM-DD')}-group`).within(() => {
        cy.findAllByText(`${today.format('ddd')}`).should($day => {
          expect($day).to.have.length(2);
          expect($day.last()).to.be.hidden;
        });
      });

      cy.axeCheckBestPractice();
    });

    it('should display layout correctly for multiply appointments - different months, same day', () => {
      // Arrange
      const today = moment();
      const response = [];

      for (let i = 1; i <= 2; i++) {
        const appt = new MockAppointment({
          id: i,
          cancellable: false,
          localStartTime: today,
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }

      const nextMonth = moment().add(1, 'month');
      const appt = new MockAppointment({
        id: '3',
        cancellable: false,
        localStartTime: nextMonth,
        status: APPOINTMENT_STATUS.booked,
      });
      response.push(appt);

      mockAppointmentsGetApi({ response });

      // Act
      AppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 3,
      });

      // Assert
      // Constrain search within list group.
      cy.findByTestId(`${today.format('YYYY-MM-DD')}-group`).within(() => {
        cy.findAllByTestId('appointment-list-item').should($list => {
          expect($list).to.have.length(2);
        });
      });

      cy.findByTestId(`appointment-list-${nextMonth.format('YYYY-MM')}`).within(
        () => {
          cy.findAllByTestId('appointment-list-item').should($list => {
            expect($list).to.have.length(1);
          });
        },
      );

      cy.axeCheckBestPractice();
    });
  });
});
