// @ts-check
import moment from 'moment';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import MockUser from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentGetApi,
  mockAppointmentCreateApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
  mockEligibilityCCApi,
} from '../../vaos-cypress-helpers';
import { APPOINTMENT_STATUS, PRIMARY_CARE } from '../../../../utils/constants';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import MockSlotResponse from '../../fixtures/MockSlotResponse';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import { getTypeOfCareById } from '../../../../utils/appointment';

const { cceType } = getTypeOfCareById(PRIMARY_CARE);
const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;

describe('VAOS direct schedule flow - Primary care', () => {
  describe('When veteran is not CC eligible', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsGetApi({ response: [] });
      mockFeatureToggles();
      mockVamcEhrApi();
    });

    describe('And one facility supports online scheduling', () => {
      const setup = () => {
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'direct',
          isEligible: true,
        });
        const response = new MockAppointmentResponse({
          id: 'mock1',
          localStartTime: moment(),
          status: APPOINTMENT_STATUS.booked,
          serviceType: 'primaryCare',
        });

        mockAppointmentCreateApi({ response });
        mockAppointmentGetApi({
          response,
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId,
          isDirect: true,
          isRequest: true,
        });
      };

      describe('And veteran does have a home address', () => {
        beforeEach(setup);

        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockClinicsApi({
            locationId: '983',
            response: MockClinicResponse.createResponses({ count: 2 }),
          });
          mockSlotsApi({
            locationId: '983',
            clinicId: '1',
            response: MockSlotResponse.createResponses({
              startTimes: [moment().add(1, 'month')],
            }),
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

          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review your appointment details/i,
            })
            .assertHeading({
              level: 2,
              name: /You.re scheduling a primary care appointment/i,
            })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        beforeEach(setup);

        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          mockClinicsApi({
            locationId: '983',
            response: MockClinicResponse.createResponses({ count: 2 }),
          });
          mockSlotsApi({
            locationId: '983',
            clinicId: '1',
            response: MockSlotResponse.createResponses({
              startTimes: [moment().add(1, 'month')],
            }),
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

          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review your appointment details/i,
            })
            .assertHeading({
              level: 2,
              name: /You.re scheduling a primary care appointment/i,
            })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And one clinic supports online scheduling', () => {
        beforeEach(setup);

        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockClinicsApi({
            locationId: '983',
            response: MockClinicResponse.createResponses({ count: 1 }),
          });
          mockSlotsApi({
            locationId: '983',
            clinicId: '1',
            response: MockSlotResponse.createResponses({
              startTimes: [moment().add(1, 'month')],
            }),
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

          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review your appointment details/i,
            })
            .assertHeading({
              level: 2,
              name: /You.re scheduling a primary care appointment/i,
            })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And user selects "I need a different clinic"', () => {
        beforeEach(setup);

        it('should start appointment request flow', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockClinicsApi({
            locationId: '983',
            response: MockClinicResponse.createResponses({ count: 2 }),
          });
          mockSlotsApi({
            locationId: '983',
            clinicId: '1',
            response: MockSlotResponse.createResponses({
              startTimes: [moment().add(1, 'month')],
            }),
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

      describe('And no clinic supports online scheduling, clinic supports requests', () => {
        beforeEach(setup);

        it('should start appointment request flow', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockClinicsApi({
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

          // Just verifying URL here since entire flow is verified in request-schedule-workflow
          DateTimeRequestPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('And more than one facility supports online scheduling', () => {
      const setup = () => {
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
        });
        const response = new MockAppointmentResponse({
          id: 'mock1',
          localStartTime: moment(),
          status: APPOINTMENT_STATUS.booked,
          serviceType: 'primaryCare',
        });

        mockAppointmentCreateApi({ response });
        mockAppointmentGetApi({
          response,
        });
        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: true,
          isRequest: true,
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: MockSlotResponse.createResponses({
            startTimes: [moment().add(1, 'month')],
          }),
        });
      };

      describe('And veteran does have a home address', () => {
        beforeEach(setup);

        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockClinicsApi({
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

          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review your appointment details/i,
            })
            .assertHeading({
              level: 2,
              name: /You.re scheduling a primary care appointment/i,
            })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        beforeEach(setup);

        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          mockClinicsApi({
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

          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review your appointment details/i,
            })
            .assertHeading({
              level: 2,
              name: /You.re scheduling a primary care appointment/i,
            })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And user selects "I need a different clinic"', () => {
        beforeEach(setup);

        it('should start appointment request flow', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockClinicsApi({
            locationId: '983',
            response: MockClinicResponse.createResponses({ count: 2 }),
          });
          mockSlotsApi({
            locationId: '983',
            clinicId: '1',
            response: MockSlotResponse.createResponses({
              startTimes: [moment().add(1, 'month')],
            }),
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

  describe('When veteran is CC eligible', () => {
    beforeEach(() => {
      vaosSetup();

      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: moment(),
        status: APPOINTMENT_STATUS.booked,
        serviceType: 'primaryCare',
      });
      mockAppointmentGetApi({
        response,
      });
      mockAppointmentCreateApi({ response });
      mockAppointmentsGetApi({ response: [] });
      mockFeatureToggles();
      mockVamcEhrApi();
    });

    describe('And more than one facility supports online scheduling', () => {
      beforeEach(() => {
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
        });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockEligibilityCCApi({ cceType });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: true,
          isRequest: true,
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: MockSlotResponse.createResponses({
            startTimes: [moment().add(1, 'month')],
          }),
        });
      });

      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
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

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/VA medical center or clinic/i)
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

        ReviewPageObject.assertUrl()
          .assertHeading({
            name: /Review your appointment details/i,
          })
          .assertHeading({
            level: 2,
            name: /You.re scheduling a primary care appointment/i,
          })
          .clickConfirmButton();

        ConfirmationPageObject.assertUrl().assertText({
          text: /We.ve scheduled and confirmed your appointment/i,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
