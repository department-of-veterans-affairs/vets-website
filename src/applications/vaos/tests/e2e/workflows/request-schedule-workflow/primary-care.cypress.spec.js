// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import TypeOfVisitPageObject from '../../page-objects/TypeOfVisitPageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityCCApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const { idV2: typeOfCareId, cceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.PRIMARY_CARE,
);
const labelRegexReasonForAppointment = /Enter a brief reason for this appointment\. Your provider will contact you if they need more details\./;

describe('VAOS request schedule flow - Primary care', () => {
  beforeEach(() => {
    vaosSetup();

    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: new Date(),
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setType('REQUEST');
    mockAppointmentGetApi({
      response,
    });
    mockAppointmentCreateApi({ response });
    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When veteran is not CC eligible', () => {
    describe('And one facility supports online scheduling', () => {
      beforeEach(() => {
        const mockEligibilityResponseDirect = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'direct',
          ineligibilityReason:
            MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
        });
        const mockEligibilityResponseRequest = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: true,
          type: 'request',
        });

        mockEligibilityDirectApi({
          response: mockEligibilityResponseDirect,
        });
        mockEligibilityRequestApi({
          response: mockEligibilityResponseRequest,
        });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983'],
          }),
        });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      });

      describe('And veteran does have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Primary care/i)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .assertSingleLocation({ locationName: /Facility 983/i })
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl()
            .assertHeading({ name: /When would you like an appointment/i })
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({ name: /What.s the reason for this appointment/i })
            .assertLabel({
              label: labelRegexReasonForAppointment,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .assertTypeOfVisitValidationErrors()
            .assertHeading({
              name: /How do you want to attend this appointment/i,
            })
            .selectVisitType('In person')
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .assertHeading({ name: /How should we contact you/i })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({ name: /Review and submit your request/ })
            .clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: true })
            .selectTypeOfCare(/Primary care/i)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .assertSingleLocation({ locationName: /Facility 983/i })
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl()
            .assertHeading({ name: /When would you like an appointment/i })
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({ name: /What.s the reason for this appointment/i })
            .assertLabel({
              label: labelRegexReasonForAppointment,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .assertHeading({
              name: /How do you want to attend this appointment/i,
            })
            .selectVisitType(/In person/i)
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .assertHeading({ name: /How should we contact you/i })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('And more than one facility supports online scheduling', () => {
      beforeEach(() => {
        const mockEligibilityResponseDirect = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'direct',
          ineligibilityReason:
            MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
        });
        const mockEligibilityResponseRequest = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: true,
          type: 'request',
        });

        mockEligibilityDirectApi({
          response: mockEligibilityResponseDirect,
        });
        mockEligibilityRequestApi({
          response: mockEligibilityResponseRequest,
        });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      });

      describe('And veteran does have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

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

          DateTimeRequestPageObject.assertUrl()
            .assertHeading({ name: /When would you like an appointment/i })
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({ name: /What.s the reason for this appointment/i })
            .assertLabel({
              label: labelRegexReasonForAppointment,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .assertHeading({
              name: /How do you want to attend this appointment/i,
            })
            .selectVisitType('In person')
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .assertHeading({ name: /How should we contact you/i })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({ name: /Review and submit your request/ })
            .clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

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

          DateTimeRequestPageObject.assertUrl()
            .assertHeading({ name: /When would you like an appointment/i })
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({ name: /What.s the reason for this appointment/i })
            .assertLabel({
              label: labelRegexReasonForAppointment,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .assertHeading({
              name: /How do you want to attend this appointment/i,
            })
            .selectVisitType(/In person/i)
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .assertHeading({ name: /How should we contact you/i })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });

  describe('When veteran is CC eligible', () => {
    beforeEach(() => {
      const mockEligibilityResponseDirect = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: false,
        type: 'direct',
        ineligibilityReason:
          MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
      });
      const mockEligibilityResponseRequest = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: true,
        type: 'request',
      });

      mockEligibilityDirectApi({
        response: mockEligibilityResponseDirect,
      });
      mockEligibilityRequestApi({
        response: mockEligibilityResponseRequest,
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({ count: 1 }),
      });
      mockEligibilityCCApi({ cceType });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId,
        isDirect: false,
        isRequest: true,
      });
    });

    describe('And no clinics support direct schedule, clinic supports requests', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .assertTypeOfFacilityValidationErrors()
          .selectTypeOfFacility(/VA medical center or clinic/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl()
          .assertHeading({ name: /When would you like an appointment/i })
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .assertHeading({ name: /What.s the reason for this appointment/i })
          .assertLabel({
            label: labelRegexReasonForAppointment,
          })
          .typeAdditionalText({
            content: 'This is a test',
          })
          .clickNextButton();

        TypeOfVisitPageObject.assertUrl()
          .assertHeading({
            name: /How do you want to attend this appointment/i,
          })
          .selectVisitType('In person')
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .assertHeading({ name: /How should we contact you/i })
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl()
          .assertHeading({ name: /Review and submit your request/ })
          .clickRequestButton();

        ConfirmationPageObject.assertUrl({ isDirect: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
