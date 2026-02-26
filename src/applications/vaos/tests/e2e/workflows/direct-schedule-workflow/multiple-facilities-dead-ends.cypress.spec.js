import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';

import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
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

describe('VAOS direct schedule flow - Multiple facilities dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingImmediateCareAlert: false,
      vaOnlineSchedulingRemoveFacilityConfigCheck: false,
      vaOnlineSchedulingUseVpg: false,
    });
    mockVamcEhrApi();
  });

  describe('When more than one facility supports online scheduling', () => {
    describe('And facility does not support scheduling for type of care', () => {});

    describe('And 502 "Bad gateway" error', () => {
      it('should display error', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockFacilitiesApi({ responseCode: 502 });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl().assertErrorAlert({
          text: /We can’t schedule your appointment right now/i,
        });

        // Assert
        cy.axeCheckBestPractice();
      });

      it('should display error message - direct schedule', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        mockEligibilityCCApi({ cceType, isEligible: false });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId: 'primaryCare',
          isDirect: true,
          isRequest: false,
        });
        mockEligibilityDirectApi({ responseCode: 502 });
        mockEligibilityRequestApi({ responseCode: 502 });
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
          .selectLocation(/Facility 983/i)
          .clickNextButton()
          .assertErrorModal({
            text: /You can.t schedule an appointment online right now/,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no clinics configured', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponseDirect = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: true,
          type: 'direct',
        });
        const mockEligibilityResponseRequest = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'request',
          ineligibilityReason:
            MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
        });
        mockEligibilityDirectApi({
          response: mockEligibilityResponseDirect,
        });
        mockEligibilityRequestApi({
          response: mockEligibilityResponseRequest,
        });

        mockClinicsApi({ locationId: '983', response: [] });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId: 'primaryCare',
          isDirect: true,
          isRequest: false,
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
          .clickNextButton()
          .assertWarningModal({
            text: /You can.t schedule this appointment online/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And limit reached', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'request',
          isEligible: false,
          ineligibilityReason:
            MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
        });
        const mockDirectEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'direct',
          ineligibilityReason: MockEligibilityResponse.DIRECT_DISABLED,
        });

        mockEligibilityRequestApi({
          response: mockEligibilityResponse,
        });
        mockEligibilityDirectApi({
          response: mockDirectEligibilityResponse,
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
        });

        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
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
          .clickNextButton()
          .assertWarningModal({
            text: /You can.t schedule this appointment online/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments - direct', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponseDirect = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'direct',
          ineligibilityReason:
            MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
        });
        const mockEligibilityResponseRequest = MockEligibilityResponse.createEligibilityDisabledResponse(
          { type: 'request' },
        );

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
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
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: true,
          isRequest: false,
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
          .clickNextButton()
          .assertWarningModal({
            text: /You can.t schedule an appointment online/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments - request', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        const mockEligibilityResponseDirect = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'direct',
          ineligibilityReason: MockEligibilityResponse.DIRECT_DISABLED,
        });
        const mockEligibilityResponseRequest = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: false,
          type: 'request',
          ineligibilityReason:
            MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
        });

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
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
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
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
          .clickNextButton()
          .assertWarningModal({
            text: /You can.t schedule an appointment online/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
