// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ScheduleCernerPageObject from '../../page-objects/ScheduleCernerPageObject';
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

describe('VAOS direct schedule flow - Cerner', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi({ isCerner: true });
  });

  describe('When one facility supports online scheduling', () => {
    it('should display "how to schedule" appointment', () => {
      // Arrange
      const mockUser = new MockUser({
        addressLine1: '123 Main St.',
      });
      mockFacilitiesApi({
        response: [new MockFacilityResponse()],
      });
      mockEligibilityCCApi({ cceType, isEligible: false });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });

      // Act
      cy.login(mockUser);

      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/Primary care/i)
        .clickNextButton();

      VAFacilityPageObject.assertUrl().clickNextButton();

      ScheduleCernerPageObject.assertUrl()
        .assertHeading({ level: 1, name: /How to schedule/i })
        .assertText({
          text: /To schedule an appointment online at this facility, go to/i,
        })
        .assertLink({ name: /My VA Health/i })
        .assertNextButton({
          isEnabled: false,
        });

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('When more than one facility supports online scheduling', () => {
    it('should display "how to schedule" appointment', () => {
      // Arrange
      const mockUser = new MockUser({
        addressLine1: '123 Main St.',
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityCCApi({ cceType, isEligible: false });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
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
        .clickNextButton();

      ScheduleCernerPageObject.assertUrl()
        .assertHeading({ level: 1, name: /How to schedule/i })
        .assertText({
          text: /To schedule an appointment online at this facility, go to/i,
        })
        .assertLink({ name: /My VA Health/i })
        .assertNextButton({
          isEnabled: false,
        });

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
