// @ts-check
import MockUser from '../../fixtures/MockUser';
import {
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityApi,
  mockEligibilityCCApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import { PRIMARY_CARE } from '../../../../utils/constants';
import { getTypeOfCareById } from '../../../../utils/appointment';

const { cceType } = getTypeOfCareById(PRIMARY_CARE);
const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;

describe('VAOS direct schedule flow - Single facility dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports online scheduling', () => {
    describe('And no available clinics and no requests', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'direct',
          isEligible: true,
        });

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
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
          .assertWarningAlert({
            text: /We found one facility that accepts online scheduling for this care/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past apptointments and request only', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityRequestApi({
          response: MockEligibilityResponse.createPatientHistoryInsufficientResponse(
            {
              type: 'request',
            },
          ),
        });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'primaryCare',
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
          .assertWarningAlert({
            text: /We found one facility that accepts online scheduling for this care/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past apptointments and direct only', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId: 'primaryCare',
          type: 'request',
          isEligible: false,
        });

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: MockEligibilityResponse.createPatientHistoryInsufficientResponse(
            {
              type: 'direct',
            },
          ),
        });
        mockEligibilityRequestApi({ response: mockEligibilityResponse });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });

        // Configure facility 983 to accept direct schedule appointments for
        // primary care.
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
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
          .assertWarningAlert({
            text: /We found one facility that accepts online scheduling for this care/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past apptointments and request only and limit reached', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityRequestApi({
          response: MockEligibilityResponse.createFacilityRequestLimitExceededResponse(
            {
              type: 'request',
            },
          ),
        });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });

        // Configure facility 983 to accept request schedule appointments for
        // primary care.
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'primaryCare',
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
          .assertWarningAlert({
            text: /We found one facility that accepts online scheduling for this care/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
