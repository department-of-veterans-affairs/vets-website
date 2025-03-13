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

      mockFeatureToggles({});
      mockVamcEhrApi();
    });

    it('should verify Video Connect at ATLAS calendar ics file format', () => {
      // Arrange
      const startDate = moment()
        .clone()
        .add(1, 'day');
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: startDate,
          future: true,
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
      const startDate = moment()
        .clone()
        .add(1, 'day');
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createMobileResponses({
          localStartTime: startDate,
          future: true,
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
      const startDate = moment()
        .clone()
        .add(1, 'day');
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: startDate,
        future: true,
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
  });

  describe('When veteran has upcoming appointments', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles({});
      mockVamcEhrApi();
    });

    it('should display upcoming appointments list', () => {
      // Arrange
      const response = [
        MockAppointmentResponse.createVAResponses({
          localStartTime: moment(),
          future: true,
        }),
        MockAppointmentResponse.createCCResponses({
          localStartTime: moment()
            .clone()
            .add(1, 'day'),
          future: true,
        }),
        MockAppointmentResponse.createPhoneResponses({
          localStartTime: moment()
            .clone()
            .add(1, 'day'),
          future: true,
        }),
        MockAppointmentResponse.createAtlasResponses({
          localStartTime: moment()
            .clone()
            .add(2, 'day'),
          future: true,
        }),
        MockAppointmentResponse.createClinicResponses({
          localStartTime: moment()
            .clone()
            .add(2, 'day'),
          future: true,
        }),
        MockAppointmentResponse.createStoreForwardResponses({
          localStartTime: moment()
            .clone()
            .add(2, 'day'),
          future: true,
        }),
        MockAppointmentResponse.createGfeResponses({
          localStartTime: moment()
            .clone()
            .add(2, 'day'),
          future: true,
        }),
        MockAppointmentResponse.createMobileResponses({
          localStartTime: moment()
            .clone()
            .add(3, 'day'),
          future: true,
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
        future: true,
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
      AppointmentDetailPageObject.assertUrl()
        .assertCancelButton()
        .clickCancelButton()
        .assertUrl()
        .assertHeading({
          name: /Would you like to cancel this appointment/i,
          level: 1,
        })
        .clickButton({ label: /Yes, cancel appointment/i })
        .assertUrl()
        .assertHeading({
          name: /You have canceled your appointment/i,
          level: 1,
        });
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
          future: true,
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
      const tomorrow = moment()
        .clone()
        .add(1, 'day');
      const response = [];

      for (let i = 1; i <= 4; i += 1) {
        const appt = new MockAppointmentResponse({
          id: i,
          cancellable: false,
          localStartTime: i <= 2 ? today : tomorrow,
          status: APPOINTMENT_STATUS.booked,
          future: true,
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
          future: true,
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
          future: true,
        });
        response.push(appt);
      }

      const nextMonth = moment()
        .clone()
        .add(1, 'month');
      const appt = new MockAppointmentResponse({
        id: '3',
        cancellable: false,
        localStartTime: nextMonth,
        status: APPOINTMENT_STATUS.booked,
        future: true,
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
          localStartTime: moment()
            .clone()
            .add(1, 'day'),
          future: true,
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

      mockFeatureToggles({});
      mockVamcEhrApi();
    });

    it('should display appointment details for CC appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createCCResponses({
        localStartTime: moment()
          .clone()
          .add(1, 'day'),
        future: true,
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

      AppointmentDetailPageObject.assertUrl().assertHeading({
        name: /Community care appointment/i,
        level: 1,
      });

      cy.axeCheckBestPractice();
    });
  });

  describe('when veteran has upcoming VA appointment', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles({});
      mockVamcEhrApi();
    });

    it('should display appointment details for VA appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createVAResponses({
        localStartTime: moment()
          .clone()
          .add(1, 'day'),
        future: true,
      });
      responses[0]
        .setLocationId('983')
        .setClinicId(1)
        .setPhysicalLocation('Room 1');
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
        .assertHeading({ name: /In-person appointment/i, level: 1 })
        .assertText({ text: /Clinic 1/i })
        .assertText({ text: /Room 1/i });

      cy.axeCheckBestPractice();
    });
  });

  describe('When veteran has upcoming video appointment', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles({});
      mockVamcEhrApi();
    });

    it('should display "Join" button if 30 minutes in the future', () => {
      // Arrange
      const response = MockAppointmentResponse.createMobileResponses({
        localStartTime: moment()
          .clone()
          .add(30, 'minutes'),
        future: true,
      });
      response[0].setUrl();

      mockAppointmentsGetApi({
        response,
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
        .assertHeading({
          name: /Video appointment/,
          level: 1,
        })
        .assertText({ text: /You can join this meeting from/i, exist: false })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display "Join" button if less than 4 hours in the past', () => {
      // Arrange
      const response = MockAppointmentResponse.createMobileResponses({
        localStartTime: moment()
          .clone()
          .add(30, 'minutes'),
        future: true,
      });
      response[0].setUrl();

      mockAppointmentsGetApi({
        response,
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
        .assertHeading({
          name: /Video appointment/,
          level: 1,
        })
        .assertText({ text: /You can join this meeting from/i, exist: false })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display "Join" button if less than 30 minutes in the future', () => {
      // Arrange
      const response = MockAppointmentResponse.createMobileResponses({
        localStartTime: moment()
          .clone()
          .add(30, 'minutes'),
        future: true,
      });
      response[0].setUrl();

      mockAppointmentsGetApi({
        response,
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
        .assertHeading({
          name: /Video appointment/,
          level: 1,
        })
        .assertText({
          text: /Join the video appointment using the link/i,
        })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for Atlas video appointment ', () => {
      // Arrange
      mockAppointmentsGetApi({
        response: MockAppointmentResponse.createAtlasResponses({
          localStartTime: moment()
            .clone()
            .add(1, 'day'),
          future: true,
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
        .assertHeading({
          name: /Video appointment at an ATLAS location/,
          level: 1,
        })
        .assertAppointmentCode()
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for clinic video appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createClinicResponses({
        localStartTime: moment(),
        future: true,
      });
      responses[0]
        .setLocationId('983')
        .setClinicId(1)
        .setPhysicalLocation('Room 1');
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
        .assertHeading({
          name: /Video appointment at a VA location/,
          level: 1,
        })
        .assertText({
          text: /Join this video appointment at a VA facility/i,
        })
        .assertText({
          text: /Room 1/i,
        })
        .assertDirections()
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for GFE video appointment.', () => {
      // Arrange
      const responses = MockAppointmentResponse.createGfeResponses({
        localStartTime: moment()
          .clone()
          .add(2, 'day'),
        future: true,
      });
      responses[0].setLocationId('983').setUrl();
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
        .assertHeading({
          name: /Video appointment/i,
          level: 1,
        })
        .assertText({
          text: /We.ll add the link to join this appointment/i,
        })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for HOME video appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createMobileResponses({
        localStartTime: moment()
          .clone()
          .subtract(31, 'minutes'),
        future: true,
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
      AppointmentDetailPageObject.assertUrl()
        .assertHeading({
          name: /Video appointment/,
          level: 1,
        })
        .assertText({
          text: /We.ll add the link to join this appointment/i,
          exist: true,
        })
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });

    it('should display appointment details for store forward video appointment', () => {
      // Arrange
      const responses = MockAppointmentResponse.createStoreForwardResponses({
        localStartTime: moment(),
        future: true,
      });
      responses[0]
        .setLocationId('983')
        .setClinicId(1)
        .setPhysicalLocation('Room 1');
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
        .assertHeading({
          name: /Video appointment at a VA location/,
          level: 1,
        })
        .assertText({
          text: /Join this video appointment at a VA facility/i,
        })
        .assertText({
          text: /Room 1/i,
        })

        .assertDirections()
        .assertAddToCalendar()
        .assertPrint();

      cy.axeCheckBestPractice();
    });
  });
});
