// @ts-check
import { addMonths, subDays } from 'date-fns';
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
const typeOfCareRegex = /Mental health/i;

function mockExistingAppointments(hasPast = false) {
  const response = [];
  if (hasPast) {
    const clinic = new MockClinicResponse({ id: '1' });
    response.push(
      new MockAppointmentResponse({
        future: false,
        status: APPOINTMENT_STATUS.booked,
        localStartTime: subDays(new Date(), 10),
      })
        .setLocation(new MockFacilityResponse({ id: '983' }))
        .setClinicId(clinic)
        .setTypeOfCare(TYPE_OF_CARE_IDS.MENTAL_HEALTH),
    );
  }
  mockAppointmentsGetApi({
    response,
  });
}

function mocksBase(requiresPast = false) {
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
  mockAppointmentGetApi({ response });
  mockEligibilityApi({ response: mockEligibilityResponse });
  mockFacilitiesApi({ response: [new MockFacilityResponse()] });
  mockSchedulingConfigurationApi({
    facilityIds: ['983'],
    typeOfCareId,
    isDirect: true,
    isRequest: true,
    overrideDirect: requiresPast
      ? {
          patientHistoryRequired: true,
        }
      : {
          patientHistoryRequired: false,
        },
  });
}

describe('VAOS direct schedule flow - Mental health', () => {
  describe('When patient has no history and flipper for MH past filtering is enabled', () => {
    beforeEach(() => {
      vaosSetup();

      mockFeatureToggles();
      mockVamcEhrApi();
    });

    describe('And one facility supports direct scheduling with no history required', () => {
      const setup = () => {
        mockExistingAppointments();
        mocksBase();
      };
      // Not testing for appointment flow completeness, just that filtering MH
      // are correct.
      beforeEach(setup);

      it.skip('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            count: 2,
            locationId: '983',
          }),
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
          .assertSomeText({
            text: typeOfCareRegex,
            minNumber: 3,
          })
          .clickConfirmButton();

        ConfirmationPageObject.assertUrl().assertText({
          text: /We.ve scheduled and confirmed your appointment/i,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
    describe('And one facility requires past history with past history existing', () => {
      const setup = () => {
        mockExistingAppointments(true);
        mocksBase(true);
      };
      beforeEach(setup);
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({
          addressLine1: '123 Main St.',
        });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            count: 2,
          }),
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
          .assertSomeText({
            text: typeOfCareRegex,
            minNumber: 3,
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
