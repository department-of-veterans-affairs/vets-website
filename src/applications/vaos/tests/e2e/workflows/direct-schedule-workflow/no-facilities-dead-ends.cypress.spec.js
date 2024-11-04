// @ts-check
import MockUser from '../../fixtures/MockUser';
import {
  mockAppointmentsGetApi,
  mockEligibilityCCApi,
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

const { cceType } = getTypeOfCareById(PRIMARY_CARE);

describe('VAOS direct schedule flow - No facility dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When no facilities are available', () => {
    describe('And no sites configured for direct or request schedule', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockEligibilityCCApi({ cceType, isEligible: false });
        mockFacilitiesApi({ response: [new MockFacilityResponse()] });

        // Configure facility 983 to disable scheduling appointments for
        // primary care.
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'primaryCare',
          isDirect: false,
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
            text: /We couldn.t find a VA facility/i,
          })
          .assertNexButton({ isEnabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
