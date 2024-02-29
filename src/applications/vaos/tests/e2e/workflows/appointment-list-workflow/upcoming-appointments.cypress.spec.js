// @ts-check
import moment from 'moment-timezone';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockAppointmentUpdateApi,
  vaosSetup,
  mockVamcEhrApi,
  mockClinicsApi,
  mockFacilityApi,
} from '../../vaos-cypress-helpers';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../../utils/constants';
import MockUser from '../../fixtures/MockUser';
import AppointmentDetailPageObject from '../../page-objects/AppointmentList/AppointmentDetailPageObject';
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';

describe('VAOS upcoming appointment flow', () => {
  describe('When veteran adds appointment to calendar', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should verify Video Connect at ATLAS calendar ics file format', () => {
      // Arrange
      const startDate = moment().add(1, 'day');
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: startDate,
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl().assertAddToCalendarLink({
        startDate,
        type: VIDEO_TYPES.adhoc,
      });

      cy.axeCheckBestPractice();
    });

    it('should verify Video Connect at home calendar ics file format', () => {
      // Arrange
      const startDate = moment().add(1, 'day');
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: startDate,
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl().assertAddToCalendarLink({
        startDate,
        type: VIDEO_TYPES.mobile,
      });

      cy.axeCheckBestPractice();
    });

    it('should verify Video Connect at VA location calendar ics file format', () => {
      // Arrange
      const startDate = moment().add(1, 'day');
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: startDate,
      });
      responses[0].setLocationId('983');
      mockAppointmentsGetApi({
        response: responses,
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl().assertAddToCalendarLink({
        startDate,
        type: VIDEO_TYPES.clinic,
      });

      cy.axeCheckBestPractice();
    });

    it('should verify Video Connect on VA device calendar ics file format', () => {
      // Arrange
      const startDate = moment().add(1, 'day');
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createGfeResponses({
          localStartTime: startDate,
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl().assertAddToCalendarLink({
        startDate,
        type: VIDEO_TYPES.gfe,
      });

      cy.axeCheckBestPractice();
    });
  });

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
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

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

    it('should print appointment details', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createVAResponses({
          localStartTime: moment().add(1, 'day'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertTypeOfCare({ text: /Primary care/i })
        .assertAddToCalendar()
        .assertPrint()
        .clickPrint();

      cy.axeCheckBestPractice();
    });
  });

  describe('when veteran has upcoming CC appointment', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should display appointment details for CC appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createCCResponses({
        localStartTime: moment().add(1, 'day'),
      });
      responses[0].setTypeOfCare('audiology').setCCProvider();

      mockAppointmentsGetApi({
        response: responses,
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({
          numberOfAppointments: 1,
        })
        .selectListItem();

      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /Type of care/,
        })
        .assertText({ text: /Community care provider/i });

      cy.axeCheckBestPractice();
    });
  });

  describe('when veteran has upcoming VA appointment', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should display appointment details for VA appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createVAResponses({
        localStartTime: moment().add(1, 'day'),
      });
      responses[0].setLocationId('983').setClinicId(1);
      mockAppointmentsGetApi({
        response: responses,
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({
          numberOfAppointments: 1,
        })
        .selectListItem();

      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /Type of care/,
        })
        .assertHeading({ name: /VA appointment/i, level: 2 })
        .assertText({ text: /Clinic 1/i });

      cy.axeCheckBestPractice();
    });
  });

  describe('When veteran has upcoming video appointment', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should display "Join" button if 30 minutes in the future', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: moment().add(30, 'minutes'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at home/,
        })
        .assertText({ text: /You can join this meeting from/i, exist: false })
        .assertJoinAppointment({ isEnabled: true })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display "Join" button if less than 4 hours in the past', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: moment().add(-240, 'minutes'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .wait({ alias: '@v2:get:appointments' })
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at home/,
        })
        .assertText({ text: /You can join this meeting from/i, exist: false })
        .assertJoinAppointment({ isEnabled: true })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display "Join" button if less than 30 minutes in the future', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: moment().add(20, 'minutes'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at home/,
        })
        .assertText({ text: /You can join this meeting from/i, exist: false })
        .assertJoinAppointment({ isEnabled: true })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for Atlas video appointment ', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: moment().add(1, 'day'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at an ATLAS location/,
        })
        .assertDirections()
        .assertAppointmentCode()
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for clinic video appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: moment(),
      });
      responses[0].setLocationId('983').setClinicId(1);
      mockAppointmentsGetApi({
        response: responses,
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at VA location/,
        })
        .assertText({
          text: /You must join this video meeting from the VA location listed below./i,
        })
        .assertJoinAppointment({ exist: false })
        .assertDirections()
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for GFE video appointment.', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createGfeResponses({
          localStartTime: moment().add(2, 'day'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect using VA device/i,
        })
        .assertJoinAppointment({ isEnabled: false })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for HOME video appointment', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: moment().add(32, 'minutes'),
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at home/,
        })
        .assertText({ text: /You can join this meeting from/i, exist: true })
        .assertJoinAppointment({ isEnabled: false })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for VA video appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: moment(),
      });
      responses[0].setLocationId('983').setClinicId(1);
      mockAppointmentsGetApi({
        response: responses,
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at VA location/,
        })
        .assertText({
          text: /You must join this video meeting from the VA location listed below/i,
        })
        .assertJoinAppointment({ exist: false })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for store forward video appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createStoreForwardResponses({
        localStartTime: moment(),
      });
      responses[0].setLocationId('983').setClinicId(1);
      mockAppointmentsGetApi({
        response: responses,
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
        }),
      });
      mockFacilityApi({
        id: '983',
        response: new MockFacilityResponse({
          id: '983',
        }),
      });

      // Act
      cy.login(new MockUser());

      AppointmentListPageObject.visit()
        .assertAppointmentList({ numberOfAppointments: 1 })
        .selectListItem();

      // Assert
      AppointmentDetailPageObject.assertUrl()
        .assertText({
          text: /VA Video Connect at VA location/,
        })
        .assertText({
          text: /You must join this video meeting from the VA location listed below./i,
        })
        .assertJoinAppointment({ exist: false })
        .assertDirections()
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });
  });
});
