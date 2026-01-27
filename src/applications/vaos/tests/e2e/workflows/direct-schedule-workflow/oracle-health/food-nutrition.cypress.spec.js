import { getTypeOfCareById } from '../../../../../utils/appointment';
import {
  INELIGIBILITY_CODES_VAOS,
  TYPE_OF_CARE_IDS,
} from '../../../../../utils/constants';
import MockClinicResponse from '../../../../fixtures/MockClinicResponse';
import MockEligibilityResponse from '../../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../../fixtures/MockFacilityResponse';
import MockRelationshipResponse from '../../../../fixtures/MockRelationshipResponse';
import MockUser from '../../../../fixtures/MockUser';
import AppointmentListPageObject from '../../../page-objects/AppointmentList/AppointmentListPageObject';
import PreferredDatePageObject from '../../../page-objects/PreferredDatePageObject';
import ProviderPageObject from '../../../page-objects/ProviderPageObject';
import TypeOfCarePageObject from '../../../page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '../../../page-objects/TypeOfFacilityPageObject';
import UrgentCareInformationPageObject from '../../../page-objects/UrgentCareInformationPageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentsGetApi,
  mockClinicsApi,
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

describe('OH direct schedule flow - Food and Nutrition', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingImmediateCareAlert: true,
    });
    mockVamcEhrApi({ isCerner: true });
  });

  describe('When the user has more than one provider available', () => {
    describe('And all providers have available slots in the next 13 months', () => {
      describe('And request enabled', () => {
        describe('And request limit reached', () => {
          it('should display choose proivder page without request option', () => {
            // Arrange
            const mockEligibilityResponse = new MockEligibilityResponse({
              facilityId: '983',
              typeOfCareId,
              ineligibilityReason:
                INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED,
            });
            const mockUser = new MockUser({ addressLine1: '123 Main St.' });

            mockClinicsApi({
              locationId: '983',
              response: MockClinicResponse.createResponses({ count: 2 }),
            });
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
              isRequest: false,
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
              .assertLink({
                name: 'Request an appointment',
                exist: false,
                useShadowDOM: true,
              })
              .clickLink({
                name: 'Choose your preferred appointment date and time',
                useShadowDOM: true,
              });

            PreferredDatePageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });

        describe('And request limit not reached', () => {
          it('should display choose provider page with request option', () => {
            // Arrange
            const mockEligibilityResponse = new MockEligibilityResponse({
              facilityId: '983',
              typeOfCareId,
            });
            const mockUser = new MockUser({ addressLine1: '123 Main St.' });

            mockClinicsApi({
              locationId: '983',
              response: MockClinicResponse.createResponses({ count: 2 }),
            });
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
              isRequest: false,
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
              .assertLink({
                name: 'Request an appointment',
                useShadowDOM: true,
              })
              .clickLink({
                name: 'Choose your preferred appointment date and time',
                useShadowDOM: true,
              });

            PreferredDatePageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });
      });
    });
    describe('And some providers have available slots in the next 13 months', () => {
      describe('And request enabled', () => {
        describe('And request limit reached', () => {
          it('should display choose proivder page without request option', () => {
            // Arrange
            const mockEligibilityResponse = new MockEligibilityResponse({
              facilityId: '983',
              typeOfCareId,
              ineligibilityReason:
                INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED,
            });
            const mockUser = new MockUser({ addressLine1: '123 Main St.' });

            mockClinicsApi({
              locationId: '983',
              response: MockClinicResponse.createResponses({ count: 2 }),
            });
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
                new MockRelationshipResponse({ hasAvailability: false }),
              ],
            });
            mockSchedulingConfigurationApi({
              facilityIds: ['983'],
              typeOfCareId,
              isDirect: true,
              isRequest: false,
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
              .assertLink({
                name: 'Request an appointment',
                exist: false,
                useShadowDOM: true,
              })
              .clickLink({
                name: 'Choose your preferred appointment date and time',
                useShadowDOM: true,
              });

            PreferredDatePageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });

        describe('And request limit not reached', () => {
          it('should display choose provider page with request option', () => {
            // Arrange
            const mockEligibilityResponse = new MockEligibilityResponse({
              facilityId: '983',
              typeOfCareId,
            });
            const mockUser = new MockUser({ addressLine1: '123 Main St.' });

            mockClinicsApi({
              locationId: '983',
              response: MockClinicResponse.createResponses({ count: 2 }),
            });
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
                new MockRelationshipResponse({
                  hasAvailability: true,
                }),
                new MockRelationshipResponse({
                  hasAvailability: false,
                }),
              ],
            });
            mockSchedulingConfigurationApi({
              facilityIds: ['983'],
              typeOfCareId,
              isDirect: true,
              isRequest: false,
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
              .assertLink({
                name: 'Request an appointment',
                useShadowDOM: true,
              })
              .clickLink({
                name: 'Choose your preferred appointment date and time',
                useShadowDOM: true,
              });

            PreferredDatePageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });
      });
    });
  });

  describe('When the user has one provider available', () => {
    describe('And all providers have available slots in the next 13 months', () => {
      describe('And request enabled', () => {
        describe('And request limit reached', () => {
          it('should display choose proivder page without request option', () => {
            // Arrange
            const mockEligibilityResponse = new MockEligibilityResponse({
              facilityId: '983',
              typeOfCareId,
              ineligibilityReason:
                INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED,
            });
            const mockUser = new MockUser({ addressLine1: '123 Main St.' });

            mockClinicsApi({
              locationId: '983',
              response: MockClinicResponse.createResponses({ count: 2 }),
            });
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
              isRequest: false,
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
              .assertLink({
                name: 'Request an appointment',
                exist: false,
                useShadowDOM: true,
              })
              .clickLink({
                name: 'Choose your preferred appointment date and time',
                useShadowDOM: true,
              });

            PreferredDatePageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });

        describe('And request limit not reached', () => {
          it('should display choose provider page with request option', () => {
            // Arrange
            const mockEligibilityResponse = new MockEligibilityResponse({
              facilityId: '983',
              typeOfCareId,
            });
            const mockUser = new MockUser({ addressLine1: '123 Main St.' });

            mockClinicsApi({
              locationId: '983',
              response: MockClinicResponse.createResponses({ count: 2 }),
            });
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
              isRequest: false,
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
              .assertLink({
                name: 'Request an appointment',
                useShadowDOM: true,
              })
              .clickLink({
                name: 'Choose your preferred appointment date and time',
                useShadowDOM: true,
              });

            PreferredDatePageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });
      });
    });
  });
});
