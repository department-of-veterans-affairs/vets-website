// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockClinicsApi,
  mockEligibilityApi,
  mockEligibilityCCApi,
  mockExistingAppointments,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const { idV2: typeOfCareId, cceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.PRIMARY_CARE,
);

describe('VAOS direct schedule flow - Single clinic dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockExistingAppointments(true);
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
          .assertClinicChoiceValidationErrors()
          .selectClinic({ selection: /I need a different clinic/i })
          .assertWarningAlert({
            text: /You’ve reached the limit for appointment requests at this location/i,
          })
          .assertNextButton({ isEnabled: false });

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
            text: /You can.t schedule an appointment online/i,
          })
          .assertText({
            text: /You haven’t had a recent appointment at this facility/i,
          })
          .assertButton({ exist: false, label: /Continue/i });

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
          .assertErrorAlert({
            text: /You can.t schedule an appointment online/i,
          })
          .assertText({
            text: /We.re sorry. There.s a problem with our system. Try again later./i,
          })
          .assertButton({ exist: false, label: /Continue/i });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
