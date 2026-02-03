// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
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

const { cceType } = getTypeOfCareById(TYPE_OF_CARE_IDS.PRIMARY_CARE);

describe('VAOS direct schedule flow - Single facility dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports online scheduling', () => {
    describe('And 502 "Bad gateway" error', () => {
      it('should display error', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        mockEligibilityCCApi({ cceType, isEligible: false });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983'],
          }),
        });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
        });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
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

        VAFacilityPageObject.assertUrl().assertErrorAlert({
          text: /You can.t schedule an appointment online right now/i,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
    describe('And no available clinics and no requests', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: [],
        });
        mockEligibilityDirectApi({
          response: new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId: 'primaryCare',
            type: 'direct',
          }),
        });
        mockEligibilityRequestApi({
          response: MockEligibilityResponse.createEligibilityDisabledResponse({
            type: 'request',
          }),
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockClinicsApi({
          locationId: '983',
          response: [],
        });
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
            text: /You can.t schedule this appointment online/i,
          })
          .assertButton({ exist: false, label: /Continue/i });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments and request only', () => {
      it('should display warning', () => {
        // Arrange

        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: MockEligibilityResponse.createEligibilityDisabledResponse(
            {},
          ),
        });
        mockEligibilityRequestApi({
          response: MockEligibilityResponse.createPatientHistoryInsufficientResponse(
            {
              type: 'request',
            },
          ),
        });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
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
            text: /You can.t schedule an appointment online/i,
          })
          .assertButton({ exist: false, label: /Continue/i });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments and direct only', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId: 'primaryCare',
          type: 'request',
          isEligible: false,
          ineligibilityReason: MockEligibilityResponse.REQUEST_DISABLED,
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
            text: /You can.t schedule an appointment online/i,
          })
          .assertButton({ exist: false, label: /Continue/i });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And no past appointments and request only and limit reached', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: MockEligibilityResponse.createEligibilityDisabledResponse(
            {},
          ),
        });
        mockEligibilityRequestApi({
          response: MockEligibilityResponse.createFacilityRequestLimitExceededResponse(
            {
              type: 'request',
            },
          ),
        });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 1 }),
        });
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
            text: /You can.t schedule this appointment online/i,
          })
          .assertButton({ exist: false, label: /Continue/i });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
