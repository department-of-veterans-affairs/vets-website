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
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';

const { cceType } = getTypeOfCareById(PRIMARY_CARE);
const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;

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

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            count: 2,
            locationId: '983',
          }),
        });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockEligibilityDirectApi({
          response: new MockEligibilityResponse({ type: 'direct' }),
        });
        mockEligibilityRequestApi({ response: {} });
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
          .selectClinic({
            selection: /I need a different clinic/i,
          })
          .assertWarningAlert({
            text: /This facility does not allow online requests for this type of care/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
