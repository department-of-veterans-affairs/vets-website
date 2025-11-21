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
import {
  INELIGIBILITY_CODES_VAOS,
  TYPE_OF_CARE_IDS,
} from '~/applications/vaos/utils/constants';

const { idV2: typeOfCareId, cceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
);

describe('When relationship API call fails with 500 error', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingOhDirectSchedule: true,
      vaOnlineSchedulingOhRequest: true,
    });
    mockVamcEhrApi({ isCerner: true });
  });

  describe('And request flow is not supported', () => {
    it('should display data fetch error', () => {
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
        response: mockEligibilityResponse.setEligibility(false),
      });
      mockEligibilityCCApi({ cceType, isEligible: true });

      mockRelationshipsApi({ response: [], responseCode: 500 });
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

      ProviderPageObject.assertUrl().assertHeading(
        /You can't schedule an appointment online right now/,
      );

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('And request flow is supported', () => {
    describe('And request limit reached', () => {
      it('should display data fetch error', () => {
        // Arrange
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,

          ineligibilityReason: INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED,
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

        mockRelationshipsApi({ response: [] });
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
            name: /Which provider do you want to schedule with?/,
          })
          .assertErrorAlert({
            text: /You can't schedule an appointment online right now/,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And request limit not reached', () => {
      it('should display page with request option', () => {
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

        mockRelationshipsApi({ response: [] });
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
            name: /Which provider do you want to schedule with/,
          })
          .assertWarningAlert({
            text: /We can't load your providers right now/,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});

describe('When user has no appointments with provider in the last 36 months', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingOhDirectSchedule: true,
      vaOnlineSchedulingOhRequest: true,
    });
    mockVamcEhrApi({ isCerner: true });
  });

  describe('And request flow supported', () => {
    beforeEach(() => {
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({ count: 2 }),
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityCCApi({ cceType, isEligible: true });

      mockRelationshipsApi({ response: [] });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId,
        isDirect: true,
        isRequest: false,
      });
    });

    describe('And request limit reached', () => {
      it('should display alert', () => {
        // Arrange
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,

          ineligibilityReason: INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED,
        });
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityDirectApi({
          response: mockEligibilityResponse,
        });
        mockEligibilityRequestApi({
          response: mockEligibilityResponse,
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

        ProviderPageObject.assertUrl().assertHeading({
          level: 1,
          name: /You can't schedule this appointment online/,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And request limit not reached', () => {
      it('should display page with request option', () => {
        // Arrange
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
        });
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityDirectApi({
          response: mockEligibilityResponse,
        });
        mockEligibilityRequestApi({
          response: mockEligibilityResponse,
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
            name: /You can't schedule this appointment online/,
          })
          .assertText({ text: /How to schedule/ });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('And request flow not supported', () => {
    before(() => {
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({ count: 2 }),
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityCCApi({ cceType, isEligible: true });

      mockRelationshipsApi({ response: [] });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId,
        isDirect: true,
        isRequest: false,
      });
    });

    it('should display alert', () => {
      // Arrange
      const mockEligibilityResponse = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
      });
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockEligibilityDirectApi({
        response: mockEligibilityResponse,
      });
      mockEligibilityRequestApi({
        response: mockEligibilityResponse.setEligibility(false),
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

      ProviderPageObject.assertUrl().assertHeading({
        level: 1,
        name: /You can't schedule this appointment online/,
      });

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
