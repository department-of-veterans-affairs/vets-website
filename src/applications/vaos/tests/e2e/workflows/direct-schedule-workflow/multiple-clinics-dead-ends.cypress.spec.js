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

describe('VAOS direct schedule flow - Multiple clinics dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When more than one facility supports online scheduling', () => {
    describe('And online requests not allowed at facility', () => {
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
          isEligible: false,
          type: 'request',
          ineligibilityReason: MockEligibilityResponse.REQUEST_DISABLED,
        });

        cy.log(mockEligibilityResponseDirect);
        cy.log(mockEligibilityResponseRequest);

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            count: 2,
            locationId: '983',
          }),
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
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .assertClinicChoiceValidationErrors()
          .selectClinic({
            selection: /I need a different clinic/i,
          })
          .assertWarningAlert({
            text: /This facility does not allow online requests for this type of care/i,
          })
          .assertNextButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
