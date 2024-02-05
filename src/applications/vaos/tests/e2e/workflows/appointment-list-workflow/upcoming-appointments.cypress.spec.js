// @ts-check
import moment from 'moment';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockAppointmentUpdateApi,
  vaosSetup,
  mockVamcEhrApi,
} from '../../vaos-cypress-helpers';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import MockUser from '../../fixtures/MockUser';

describe('VAOS upcoming appointment flow', () => {
  describe('When veteran has upcoming appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should display upcoming appointments list', () => {
      // Arrange
      const response = [
        MockAppointmentResponse.createVAResponses({ localStartTime: moment() }),
        MockAppointmentResponse.createCCResponses({
          localStartTime: moment().add(1, 'day'),
        }),
        MockAppointmentResponse.createPhoneResponses({
          localStartTime: moment().add(1, 'day'),
        }),
        MockAppointmentResponse.createAtlasResponses({
          localStartTime: moment().add(2, 'day'),
        }),
        MockAppointmentResponse.createClinicResponses({
          localStartTime: moment().add(2, 'day'),
        }),
        MockAppointmentResponse.createStoreForwardResponses({
          localStartTime: moment().add(2, 'day'),
        }),
        MockAppointmentResponse.createGfeResponses({
          localStartTime: moment().add(2, 'day'),
        }),
        MockAppointmentResponse.createMobileResponses({
          localStartTime: moment().add(3, 'day'),
        }),
      ];

      mockAppointmentsGetApi({
        response,
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit().assertAppointmentList({
        numberOfAppointments: 8,
      });

      // Assert
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for CC appointment', () => {
      // Arrange
      const today = moment();

      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createCCResponses({
          localStartTime: today,
        }),
      });

      // Act
      cy.login(new MockUser());

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
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createClinicResponses({
          localStartTime: moment(),
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect at VA location/i).should('exist');
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for Atlas video appointment ', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: moment().add(1, 'day'),
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect at an ATLAS location/i);
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for GFE video appointment.', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createGfeResponses({
          localStartTime: moment().add(2, 'day'),
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect using VA device/i);
      cy.axeCheckBestPractice();
    });

    it('should display upcoming appointment details for HOME video appointment ', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: moment().add(32, 'minutes'),
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      cy.findByText(/VA Video Connect at home/i);
      cy.axeCheckBestPractice();
    });

    it("should display warning when veteran doesn't have any appointments", () => {
      // Arrange
      cy.login(new MockUser());

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
      cy.login(new MockUser());

      AppointmentListPageObject.visit();

      // Assert
      cy.findByText(/We.re sorry\. We.ve run into a problem/i);
      cy.axeCheckBestPractice();
    });

    it('should alow veteran to cancel appointment', () => {
      // Arrange
      const response = new MockAppointmentResponse({
        cancellable: true,
        localStartTime: moment(),
      });

      const canceledAppt = {
        ...response,
        attributes: {
          ...response.attributes,
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

      mockAppointmentsGetApi({ response: [response] });
      mockAppointmentUpdateApi({ response: canceledAppt });

      // Act
      cy.login(new MockUser());

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
        .find('h2')
        .should('be.visible')
        .and('contain', 'Your appointment has been canceled');
      cy.get('#cancelAppt')
        .shadow()
        .get('.va-modal-alert-body va-button')
        .first()
        .click();

      cy.findByText(/You canceled your appointment/i);

      cy.axeCheckBestPractice();
    });

    it('should display layout correctly for single appointment - same month, different day', () => {
      // Arrange
      const today = moment();
      const response = [];

      for (let i = 1; i <= 2; i += 1) {
        const appt = new MockAppointmentResponse({
          id: i,
          localStartTime: moment(today).add(i, 'day'),
        });
        response.push(appt);
      }
      mockAppointmentsGetApi({ response });

      // Act
      cy.login(new MockUser());

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

      for (let i = 1; i <= 4; i += 1) {
        const appt = new MockAppointmentResponse({
          id: i,
          cancellable: false,
          localStartTime: i <= 2 ? today : tomorrow,
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }

      mockAppointmentsGetApi({ response });

      // Act
      cy.login(new MockUser());

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

      for (let i = 1; i <= 2; i += 1) {
        const appt = new MockAppointmentResponse({
          id: i,
          cancellable: false,
          localStartTime: today,
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }
      mockAppointmentsGetApi({ response });

      // Act
      cy.login(new MockUser());

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

      for (let i = 1; i <= 2; i += 1) {
        const appt = new MockAppointmentResponse({
          id: i,
          cancellable: false,
          localStartTime: today,
          status: APPOINTMENT_STATUS.booked,
        });
        response.push(appt);
      }

      const nextMonth = moment().add(1, 'month');
      const appt = new MockAppointmentResponse({
        id: '3',
        cancellable: false,
        localStartTime: nextMonth,
        status: APPOINTMENT_STATUS.booked,
      });
      response.push(appt);

      mockAppointmentsGetApi({ response });

      // Act
      cy.login(new MockUser());

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
