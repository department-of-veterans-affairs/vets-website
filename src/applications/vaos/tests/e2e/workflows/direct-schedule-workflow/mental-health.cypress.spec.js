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
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfMentalHealthPageObject from '../../page-objects/TypeOfMentalHealthPageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockClinicsApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockExistingAppointments,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

/**
 *
 * @param {string} typeOfCareId
 * @param {boolean} directRequiresPast, defaults to false
 * @param {boolean} requestDisabled, defaults to false
 * @returns {void}
 */
function mocksBase(
  typeOfCareId,
  directRequiresPast = false,
  requestDisabled = false,
  override = false,
) {
  const mockEligibilityResponseDirect = new MockEligibilityResponse({
    facilityId: '983',
    typeOfCareId,
    isEligible: !directRequiresPast,
    type: 'direct',
    ineligibilityReason: directRequiresPast
      ? MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT
      : undefined,
  });
  const mockEligibilityResponseRequest = new MockEligibilityResponse({
    facilityId: '983',
    typeOfCareId,
    isEligible: !requestDisabled,
    type: 'request',
    ineligibilityReason: requestDisabled
      ? MockEligibilityResponse.REQUEST_DISABLED
      : undefined,
  });
  mockEligibilityDirectApi({
    response: mockEligibilityResponseDirect,
  });
  mockEligibilityRequestApi({
    response: mockEligibilityResponseRequest,
  });

  const response = new MockAppointmentResponse({
    id: 'mock1',
    localStartTime: new Date(),
    status: APPOINTMENT_STATUS.booked,
    future: true,
  });

  mockAppointmentCreateApi({ response });
  mockAppointmentGetApi({ response });
  mockFacilitiesApi({ response: [new MockFacilityResponse()] });
  mockSchedulingConfigurationApi({
    facilityIds: ['983'],
    typeOfCareId,
    isDirect: true,
    isRequest: true,
    overrideDirect: override
      ? {
          patientHistoryRequired: true,
        }
      : {
          patientHistoryRequired: false,
        },
  });
}

describe('VAOS direct schedule flow - Mental health', () => {
  describe('When flipper for MH past filtering is enabled', () => {
    beforeEach(() => {
      vaosSetup();
      mockFeatureToggles();
      mockVamcEhrApi();
    });

    describe('And patient chooses mental health care with a specialist', () => {
      const { idV2: typeOfCareId, name: typeOfCareName } = getTypeOfCareById(
        TYPE_OF_CARE_IDS.MENTAL_HEALTH_SERVICES_ID,
      );
      const typeOfCareRegex = /Mental health/i;

      describe('And patient has no history and one facility supports direct scheduling with no history required', () => {
        const setup = () => {
          mockExistingAppointments(true);
          mocksBase(typeOfCareId, false);
        };
        // Not testing for appointment flow completeness, just that filtering MH
        // are correct.
        beforeEach(setup);

        it('should submit form', () => {
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

          TypeOfMentalHealthPageObject.assertUrl()
            .selectTypeOfMentalHealth(/Mental health care with a specialist/i)
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
            .assertSomeText({ text: typeOfCareName })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And patient has history and one facility requires past history to schedule', () => {
        const setup = () => {
          mockExistingAppointments(true);
          mocksBase(typeOfCareId); // would not return requires past hx if has history
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

          TypeOfMentalHealthPageObject.assertUrl()
            .selectTypeOfMentalHealth(/Mental health care with a specialist/i)
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
            .assertSomeText({ text: typeOfCareName })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('And patient chooses substance use problem services', () => {
      const { idV2: typeOfCareId, name: typeOfCareName } = getTypeOfCareById(
        TYPE_OF_CARE_IDS.MENTAL_HEALTH_SUBSTANCE_USE_ID,
      );
      const typeOfCareRegex = /Mental health/i;

      describe('And patient has history and one facility requires past history to schedule', () => {
        const setup = () => {
          mockExistingAppointments(true);
          mocksBase(typeOfCareId, false, false, true);
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

          TypeOfMentalHealthPageObject.assertUrl()
            .selectTypeOfMentalHealth(/Substance use problem services/i)
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
            .assertSomeText({ text: typeOfCareName })
            .clickConfirmButton();

          ConfirmationPageObject.assertUrl().assertText({
            text: /We.ve scheduled and confirmed your appointment/i,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('And patient chooses mental health care in a primary care setting services', () => {
      const { idV2: typeOfCareId, name: typeOfCareName } = getTypeOfCareById(
        TYPE_OF_CARE_IDS.MENTAL_HEALTH_PRIMARY_CARE_ID,
      );
      const typeOfCareRegex = /Mental health/i;

      describe('And patient has history and one facility requires past history to schedule', () => {
        const setup = () => {
          mockExistingAppointments(true);
          mocksBase(typeOfCareId, false, false, true);
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

          TypeOfMentalHealthPageObject.assertUrl()
            .selectTypeOfMentalHealth(
              /Mental health care in a primary care setting/i,
            )
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
            .assertSomeText({ text: typeOfCareName })
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
});
