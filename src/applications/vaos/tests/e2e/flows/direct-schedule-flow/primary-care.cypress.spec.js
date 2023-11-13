// @ts-check
import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import { MockUser } from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockClinicApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import { MockEligibility } from '../../fixtures/MockEligibility';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import { MockSlot } from '../../fixtures/MockSlot';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import { MockClinicResponse } from '../../fixtures/MockClinicResponse';
import { MockFacility } from '../../fixtures/MockFacility';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';

describe('VAOS direct schedule flow - Primary care', () => {
  beforeEach(() => {
    vaosSetup();

    const appt = new MockAppointment({
      id: 'mock1',
      localStartTime: moment(),
      status: APPOINTMENT_STATUS.booked,
      serviceType: 'primaryCare',
    });
    mockAppointmentApi({
      response: {
        ...appt,
      },
    });
    mockAppointmentCreateApi({ response: appt });
    mockAppointmentsApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports online scheduling', () => {
    beforeEach(() => {
      const mockEligibility = new MockEligibility({
        facilityId: '983',
        typeOfCare: 'primaryCare',
        type: 'direct',
        isEligible: true,
      });

      mockEligibilityApi({ response: mockEligibility });
      mockFacilitiesApi({ response: [new MockFacility()] });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });
    });

    describe('And veteran does have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockSlot = new MockSlot({
          id: 1,
          start: moment().add(1, 'month'),
        });

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [mockSlot],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        // TypeOfFacilityPageObject.assertUrl()
        //   .selectTypeOfFacility(/VA medical center or clinic/i)
        //   .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
          })
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i })
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate()
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });
        cy.findByText('We’ve scheduled and confirmed your appointment.');

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();
        const mockSlot = new MockSlot({
          id: 1,
          start: moment().add(1, 'month'),
        });

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [mockSlot],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: true })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl().clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i })
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate()
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And one clinic supports online scheduling', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockSlot = new MockSlot({
          id: 1,
          start: moment().add(1, 'month'),
        });

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [mockSlot],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
          })
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .assertSingleClinic()
          .selectRadioButton(/Yes. make my appointment here/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate()
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });
        cy.findByText('We’ve scheduled and confirmed your appointment.');

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And user selects "I need a different clinic"', () => {
      it('should start appointment request flow', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockSlot = new MockSlot({
          id: 1,
          start: moment().add(1, 'month'),
        });

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [mockSlot],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
          })
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/I need a different clinic/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl();

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no clinic supports online scheduling', () => {
      it('should start appointment request flow', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicApi({
          locationId: '983',
          response: [],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
          })
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl();

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When more than one facility supports online scheduling', () => {
    beforeEach(() => {
      const mockEligibility = new MockEligibility({
        facilityId: '983',
        typeOfCare: 'primaryCare',
        isDirectSchedule: true,
      });
      const mockSlot = new MockSlot({ id: 1, start: moment().add(1, 'month') });

      mockFacilitiesApi({
        response: MockFacility.createMockFacilities({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityApi({ response: mockEligibility });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        response: [mockSlot],
      });
    });

    describe('And veteran does have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i })
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate()
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: true })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i })
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate()
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And user selects "I need a different clinic"', () => {
      it('should start appointment request flow', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockSlot = new MockSlot({
          id: 1,
          start: moment().add(1, 'month'),
        });

        mockClinicApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [mockSlot],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/I need a different clinic/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl();

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
