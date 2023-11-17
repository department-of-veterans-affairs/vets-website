// @ts-check
import { MockUser } from '../../fixtures/MockUser';
import {
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import { MockFacility } from '../../fixtures/MockFacility';

describe('VAOS direct schedule flow - No facility dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When no facilities are available', () => {
    describe('And no sites configured for direct or request schedule', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockFacilitiesApi({ response: [new MockFacility()] });

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
          .assertNexButton({ enabled: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
