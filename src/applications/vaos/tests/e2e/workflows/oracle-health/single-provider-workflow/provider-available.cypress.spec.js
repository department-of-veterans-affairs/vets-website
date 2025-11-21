import MockRelationshipResponse from '~/applications/vaos/tests/fixtures/MockRelationshipResponse';
import AppointmentListPageObject from '~/applications/vaos/tests/e2e/page-objects/AppointmentList/AppointmentListPageObject';
import ProviderPageObject from '~/applications/vaos/tests/e2e/page-objects/ProviderPageObject';
import TypeOfCarePageObject from '~/applications/vaos/tests/e2e/page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '~/applications/vaos/tests/e2e/page-objects/TypeOfFacilityPageObject';
import UrgentCareInformationPageObject from '~/applications/vaos/tests/e2e/page-objects/UrgentCareInformationPageObject';
import VAFacilityPageObject from '~/applications/vaos/tests/e2e/page-objects/VAFacilityPageObject';
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
} from '~/applications/vaos/tests/e2e/vaos-cypress-helpers';
import MockClinicResponse from '~/applications/vaos/tests/fixtures/MockClinicResponse';
import MockEligibilityResponse from '~/applications/vaos/tests/fixtures/MockEligibilityResponse';
import MockFacilityResponse from '~/applications/vaos/tests/fixtures/MockFacilityResponse';
import MockUser from '~/applications/vaos/tests/fixtures/MockUser';
import { getTypeOfCareById } from '~/applications/vaos/utils/appointment';
import { TYPE_OF_CARE_IDS } from '~/applications/vaos/utils/constants';

const { idV2: typeOfCareId, cceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
);

describe('When the user has one provider available', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingOhDirectSchedule: true,
      vaOnlineSchedulingOhRequest: true,
    });
    mockVamcEhrApi({ isCerner: true });
  });
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingOhDirectSchedule: true,
      vaOnlineSchedulingOhRequest: true,
    });
    mockVamcEhrApi({ isCerner: true });
  });

  describe('And direct scheduling enabled', () => {
    describe('And all providers have available slots in the next 13 months', () => {
      describe('And request enabled', () => {
        describe('And request limit reached', () => {
          it('should display choose proivder page without request option');
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
              response: MockRelationshipResponse.createResponses(),
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

            ProviderPageObject.assertUrl();

            // Assert
            cy.axeCheckBestPractice();
          });
        });
      });
      describe('And request not enabled', () => {
        it('should display choose provider page without request option');
      });
    });
    describe('And some providers have available slots in the next 13 months', () => {
      describe('And request enabled', () => {
        describe('And request limit reached', () => {
          it('should display choose proivder page with request option');
        });
        describe('And request limit not reached', () => {
          it('should display error page');
        });
      });
      describe('And request not enabled', () => {
        it('should display error page');
      });
    });
    describe('And no providers have available slots in the next 13 months', () => {
      describe('And request endabled', () => {
        describe('and request limit reached', () => {
          it('should display error page');
        });
        describe('and request limit not reached', () => {
          it('should display choose provider page with request option');
        });
      });
      describe('And request not endabled', () => {
        it('should display error page');
      });
    });
  });

  describe('And direct scheduling not enabled', () => {
    describe('And request enabled', () => {
      describe('And request limit reached', () => {
        it('should display alert');
      });
      describe('And request limit not reached', () => {
        it('should display single facility page');
      });
    });
    describe('And request not enabled', () => {
      it('should display alert');
    });
  });
});
