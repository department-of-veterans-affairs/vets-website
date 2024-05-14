// @ts-check
import MockUser from '../../fixtures/MockUser';
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
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import { getTypeOfCareById } from '../../../../utils/appointment';
import { PRIMARY_CARE } from '../../../../utils/constants';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';

const { cceType } = getTypeOfCareById(PRIMARY_CARE);
const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;

describe('VAOS direct schedule flow - Multiple facilities dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
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
          text: /We.re sorry. We.ve run into a problem/i,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no clinics configured', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'direct',
          isEligible: true,
        });

        mockClinicsApi({ locationId: '983', response: [] });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: mockEligibilityResponse,
        });
        mockEligibilityRequestApi({ response: {} });
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
            text: /We couldn.t find a clinic for this type of care/i,
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

        mockEligibilityRequestApi({
          response: mockEligibilityResponse,
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
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
            text: /You.ve reached the limit for appointment requests/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments - direct', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'direct',
          isEligible: false,
          ineligibilityReason:
            MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
        });

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: mockEligibilityResponse,
        });
        mockEligibilityRequestApi({
          response: {},
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
            text: /We couldn.t find a recent appointment at this location/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments - request', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'request',
          isEligible: false,
          ineligibilityReason:
            MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
        });

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: {},
        });
        mockEligibilityRequestApi({
          response: mockEligibilityResponse,
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
            text: /We can.t find a recent appointment for you/i,
          });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
