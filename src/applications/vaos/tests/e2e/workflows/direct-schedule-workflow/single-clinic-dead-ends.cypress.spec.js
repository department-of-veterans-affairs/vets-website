// @ts-check
import MockUser from '../../fixtures/MockUser';
import {
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityApi,
  mockEligibilityCCApi,
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
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';

const { cceType } = getTypeOfCareById(PRIMARY_CARE);
const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;

describe('VAOS direct schedule flow - Single clinic dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one clinic supports online scheduling and user selects "I need a different clinic"', () => {
    beforeEach(() => {
      mockEligibilityCCApi({ cceType, isEligible: false });
      mockFacilitiesApi({ response: [new MockFacilityResponse()] });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId,
        isDirect: true,
        isRequest: true,
      });
    });

    describe('And request only and limit reached', () => {
      it('should dislay warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          type: 'direct',
          isEligible: false,
          ineligibilityReason:
            MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
        });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
          })
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/I need a different clinic/i)
          .assertWarningAlert({
            text: /You’ve reached the limit for appointment requests at this location/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    // TODO: Update flow diagram
    describe('And no past appointments', () => {
      it('should dislay warning', () => {
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
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });

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
          .assertText({
            text: /To request an appointment online at this location, you need to have had a primary care appointment at this facility within the last 24 months/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    // TODO: Update flow diagram
    describe('And eligibility API endpoint error', () => {
      it('should dislay warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockEligibilityApi({ responseCode: 500 });

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
          .assertText({
            text: /Something went wrong on our end. Please try again later./i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
