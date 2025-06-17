// @ts-check
import { addMonths } from 'date-fns';
import { getTypeOfCareById } from '../../../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockSlotResponse from '../../../fixtures/MockSlotResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const { idV2: typeOfCareId } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.MENTAL_HEALTH,
);
const typeOfCareRegex = new RegExp('Mental health', 'i');

describe('VAOS direct schedule flow - Mental health', () => {
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
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.booked,
          future: true,
        });

        mockAppointmentCreateApi({ response });
        mockAppointmentGetApi({
          response,
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId,
          isDirect: true,
          isRequest: true,
          // overrideDirect: {
          //   patientHistoryRequired: true,
          //   patientHistoryDuration: 730,
          //   canCancel: true,
          //   enabled: true,
          // },
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
              startTimes: [addMonths(new Date(), 1)],
            }),
          });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(typeOfCareRegex)
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
              name: /Review and confirm your appointment details/i,
            })
            .assertText({ text: typeOfCareRegex })
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
              startTimes: [addMonths(new Date(), 1)],
            }),
          });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: true })
            .selectTypeOfCare(typeOfCareRegex)
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
              name: /Review and confirm your appointment details/i,
            })
            .assertText({ text: typeOfCareRegex })
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
              startTimes: [addMonths(new Date(), 1)],
            }),
          });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(typeOfCareRegex)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .assertSingleLocation({
              locationName: /Cheyenne VA Medical Center/i,
            })
            .clickNextButton();

          ClinicChoicePageObject.assertUrl()
            .assertSingleClinic()
            .selectClinic({ selection: /Yes. make my appointment here/i })
            .clickNextButton();

          PreferredDatePageObject.assertUrl()
            .typeDate()
            .clickNextButton();

          DateTimeSelectPageObject.assertUrl()
            .assertHeading({
              name: /What date and time do you want for this appointment?/i,
            })
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({ name: /What’s the reason for this appointment?/i })
            .selectReasonForAppointment()
            .typeAdditionalText({ content: 'This is a test' })
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .assertHeading({ name: /How should we contact you/i })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review and confirm your appointment details/i,
            })
            .assertText({ text: typeOfCareRegex })
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
              startTimes: [addMonths(new Date(), 1)],
            }),
          });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(typeOfCareRegex)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .assertSingleLocation({
              locationName: /Cheyenne VA Medical Center/i,
            })
            .clickNextButton();

          ClinicChoicePageObject.assertUrl()
            .selectClinic({ selection: /I need a different clinic/i })
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
            .selectTypeOfCare(typeOfCareRegex)
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
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.booked,
          future: true,
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
            startTimes: [addMonths(new Date(), 1)],
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
            .selectTypeOfCare(typeOfCareRegex)
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
              name: /Review and confirm your appointment details/i,
            })
            .assertText({ text: typeOfCareRegex })
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
            .selectTypeOfCare(typeOfCareRegex)
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
              name: /Review and confirm your appointment details/i,
            })
            .assertText({ text: typeOfCareRegex })
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
              startTimes: [addMonths(new Date(), 1)],
            }),
          });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(typeOfCareRegex)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();

          ClinicChoicePageObject.assertUrl()
            .selectClinic({ selection: /I need a different clinic/i })
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });
});
