import { getTypeOfCareById } from '../../../../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../../../../utils/constants';
import MockAppointmentResponse from '../../../../fixtures/MockAppointmentResponse';
import MockEligibilityResponse from '../../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../../fixtures/MockFacilityResponse';
import MockRelationshipResponse from '../../../../fixtures/MockRelationshipResponse';
import MockUser from '../../../../fixtures/MockUser';
import AppointmentListPageObject from '../../../page-objects/AppointmentList/AppointmentListPageObject';
import ConfirmationPageObject from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import DateTimeRequestPageObject from '../../../page-objects/DateTimeRequestPageObject';
import ProviderPageObject from '../../../page-objects/ProviderPageObject';
import ReasonForAppointmentPageObject from '../../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../../page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '../../../page-objects/TypeOfFacilityPageObject';
import TypeOfVisitPageObject from '../../../page-objects/TypeOfVisitPageObject';
import UrgentCareInformationPageObject from '../../../page-objects/UrgentCareInformationPageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockEligibilityCCApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockRelationshipsApi,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

const { idV2: typeOfCareId, cceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
);
const labelRegexReasonForAppointment = /Enter a brief reason for this appointment\. Your provider will contact you if they need more details\./;

describe('OH request flow - Food and Nutrition', () => {
  beforeEach(() => {
    vaosSetup();
    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: new Date(),
      status: APPOINTMENT_STATUS.proposed,
      pending: true,
    }).setType('REQUEST');
    mockAppointmentGetApi({ response });
    mockAppointmentCreateApi({ response });
    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingImmediateCareAlert: true,
    });
    mockVamcEhrApi({ isCerner: true });
  });

  describe('When the user has more than one provider available', () => {
    describe('And both direct scheduling and request enabled', () => {
      describe('And request limit not reached', () => {
        it('should submit form', () => {
          // Arrange
          const mockEligibilityResponse = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
          });
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockFacilitiesApi({
            response: MockFacilityResponse.createResponses({
              facilityIds: ['983', '984'],
            }),
          });
          mockEligibilityDirectApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityRequestApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityCCApi({ cceType, isEligible: true });
          mockRelationshipsApi({
            response: [
              new MockRelationshipResponse(),
              new MockRelationshipResponse(),
            ],
          });
          mockSchedulingConfigurationApi({
            facilityIds: ['983'],
            typeOfCareId,
            isDirect: true,
            isRequest: true,
          });

          // Act
          cy.login(mockUser);
          AppointmentListPageObject.visit().scheduleAppointment(
            'Schedule a new appointment',
          );
          UrgentCareInformationPageObject.assertUrl().scheduleAppointment();
          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Nutrition and food/i)
            .clickNextButton();
          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/VA medical center or clinic/i)
            .clickNextButton();
          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();
          ProviderPageObject.assertUrl()
            .assertHeading({
              level: 1,
              name: /Which provider do you want to schedule with/i,
            })
            .clickLink({
              name: 'Request an appointment',
              useShadowDOM: true,
            });
          DateTimeRequestPageObject.assertUrl()
            .assertHeading({
              name: /When would you like an appointment/i,
            })
            .selectFirstAvailableDate()
            .clickNextButton();
          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({
              name: /What.s the reason for this appointment/i,
            })
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
            .assertHeading({
              name: /How should we contact you/i,
            })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();
          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review and submit your request/,
            })
            .clickRequestButton();
          ConfirmationPageObject.assertUrl({
            isDirect: false,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
    describe('And only request enabled', () => {
      describe('And request limit not reached', () => {
        it('should submit form', () => {
          // Arrange
          const mockEligibilityResponse = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
          });
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockFacilitiesApi({
            response: MockFacilityResponse.createResponses({
              facilityIds: ['983', '984'],
            }),
          });
          mockEligibilityDirectApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityRequestApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityCCApi({ cceType, isEligible: true });
          mockRelationshipsApi({
            response: [
              new MockRelationshipResponse(),
              new MockRelationshipResponse(),
            ],
          });
          mockSchedulingConfigurationApi({
            facilityIds: ['983'],
            typeOfCareId,
            isDirect: false,
            isRequest: true,
          });

          // Act
          cy.login(mockUser);
          AppointmentListPageObject.visit().scheduleAppointment(
            'Schedule a new appointment',
          );
          UrgentCareInformationPageObject.assertUrl().scheduleAppointment();
          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Nutrition and food/i)
            .clickNextButton();
          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/VA medical center or clinic/i)
            .clickNextButton();
          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();
          ProviderPageObject.assertUrl()
            .assertHeading({
              level: 1,
              name: /Which provider do you want to schedule with/i,
            })
            .clickLink({
              name: 'Request an appointment',
              useShadowDOM: true,
            });
          DateTimeRequestPageObject.assertUrl()
            .assertHeading({
              name: /When would you like an appointment/i,
            })
            .selectFirstAvailableDate()
            .clickNextButton();
          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({
              name: /What.s the reason for this appointment/i,
            })
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
            .assertHeading({
              name: /How should we contact you/i,
            })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();
          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review and submit your request/,
            })
            .clickRequestButton();
          ConfirmationPageObject.assertUrl({
            isDirect: false,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });

  describe('When the user has one provider available', () => {
    describe('And both direct scheduling and request enabled', () => {
      describe('And request limit not reached', () => {
        it('should submit form', () => {
          // Arrange
          const mockEligibilityResponse = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
          });
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockFacilitiesApi({
            response: MockFacilityResponse.createResponses({
              facilityIds: ['983', '984'],
            }),
          });
          mockEligibilityDirectApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityRequestApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityCCApi({ cceType, isEligible: true });
          mockRelationshipsApi({
            response: [new MockRelationshipResponse()],
          });
          mockSchedulingConfigurationApi({
            facilityIds: ['983'],
            typeOfCareId,
            isDirect: true,
            isRequest: true,
          });

          // Act
          cy.login(mockUser);
          AppointmentListPageObject.visit().scheduleAppointment(
            'Schedule a new appointment',
          );
          UrgentCareInformationPageObject.assertUrl().scheduleAppointment();
          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Nutrition and food/i)
            .clickNextButton();
          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/VA medical center or clinic/i)
            .clickNextButton();
          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();
          ProviderPageObject.assertUrl()
            .assertHeading({
              level: 1,
              name: /Your nutrition and food provider/i,
            })
            .clickLink({
              name: 'Request an appointment',
              useShadowDOM: true,
            });
          DateTimeRequestPageObject.assertUrl()
            .assertHeading({
              name: /When would you like an appointment/i,
            })
            .selectFirstAvailableDate()
            .clickNextButton();
          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({
              name: /What.s the reason for this appointment/i,
            })
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
            .assertHeading({
              name: /How should we contact you/i,
            })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();
          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review and submit your request/,
            })
            .clickRequestButton();
          ConfirmationPageObject.assertUrl({
            isDirect: false,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
    describe('And only request enabled', () => {
      describe('And request limit not reached', () => {
        it('should submit form', () => {
          // Arrange
          const mockEligibilityResponse = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
          });
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          mockFacilitiesApi({
            response: MockFacilityResponse.createResponses({
              facilityIds: ['983', '984'],
            }),
          });
          mockEligibilityDirectApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityRequestApi({
            response: mockEligibilityResponse,
          });
          mockEligibilityCCApi({ cceType, isEligible: true });
          mockRelationshipsApi({
            response: [new MockRelationshipResponse()],
          });
          mockSchedulingConfigurationApi({
            facilityIds: ['983'],
            typeOfCareId,
            isDirect: false,
            isRequest: true,
          });

          // Act
          cy.login(mockUser);
          AppointmentListPageObject.visit().scheduleAppointment(
            'Schedule a new appointment',
          );
          UrgentCareInformationPageObject.assertUrl().scheduleAppointment();
          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Nutrition and food/i)
            .clickNextButton();
          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/VA medical center or clinic/i)
            .clickNextButton();
          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();
          ProviderPageObject.assertUrl()
            .assertHeading({
              level: 1,
              name: /Your nutrition and food provider/i,
            })
            .clickLink({
              name: 'Request an appointment',
              useShadowDOM: true,
            });
          DateTimeRequestPageObject.assertUrl()
            .assertHeading({
              name: /When would you like an appointment/i,
            })
            .selectFirstAvailableDate()
            .clickNextButton();
          ReasonForAppointmentPageObject.assertUrl()
            .assertHeading({
              name: /What.s the reason for this appointment/i,
            })
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
            .assertHeading({
              name: /How should we contact you/i,
            })
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();
          ReviewPageObject.assertUrl()
            .assertHeading({
              name: /Review and submit your request/,
            })
            .clickRequestButton();
          ConfirmationPageObject.assertUrl({
            isDirect: false,
          });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });
});
