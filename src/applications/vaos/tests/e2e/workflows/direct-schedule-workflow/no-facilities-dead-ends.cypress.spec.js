// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentsGetApi,
  mockEligibilityCCApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const { cceType } = getTypeOfCareById(TYPE_OF_CARE_IDS.PRIMARY_CARE);

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
            text: /You can.t schedule this appointment online/i,
          })
          .assertButton({ label: /Continue/i, exist: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
