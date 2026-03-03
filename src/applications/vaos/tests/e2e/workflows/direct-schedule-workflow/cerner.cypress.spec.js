import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ScheduleCernerPageObject from '../../page-objects/ScheduleCernerPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentsGetApi,
  mockEligibilityCCApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockRelationshipsApi,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const { cceType } = getTypeOfCareById(TYPE_OF_CARE_IDS.PRIMARY_CARE);
const { cceType: nutritionCceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
);

describe('VAOS direct schedule flow - Cerner', () => {
  describe('When vaOnlineSchedulingRemoveFacilityConfigCheck is false', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsGetApi({ response: [] });
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
        mockFeatureToggles({
          vaOnlineSchedulingImmediateCareAlert: false,
          vaOnlineSchedulingRemoveFacilityConfigCheck: false,
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
        mockFeatureToggles({
          vaOnlineSchedulingImmediateCareAlert: false,
          vaOnlineSchedulingRemoveFacilityConfigCheck: false,
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

  describe('When vaOnlineSchedulingRemoveFacilityConfigCheck is true', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsGetApi({ response: [] });
      mockFeatureToggles();
      mockVamcEhrApi({ isCerner: true });
    });

    describe('When one facility supports online scheduling', () => {
      describe('And type of care is not food and nutrition or pharmacy', () => {
        it('should display "how to schedule" appointment page', () => {
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
            .assertHeading({
              level: 1,
              name: /You can.t schedule this appointment online/i,
            })
            .assertText({
              text: /You can also access tools to schedule appointments online in the My VA Health portal/,
              exist: false,
            });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And type of care is pharmacy', () => {
        describe('And direct and request schedule is disabled', () => {
          it('should display ineligibility alert when not eligible for direct or request scheduling', () => {
            // Arrange
            const mockUser = new MockUser({
              addressLine1: '123 Main St.',
            });
            mockFacilitiesApi({
              response: [new MockFacilityResponse()],
            });
            mockEligibilityCCApi({ cceType, isEligible: false });
            mockEligibilityDirectApi({
              response: new MockEligibilityResponse({
                typeOfCareId: 'clinicalPharmacyPrimaryCare',
                type: 'direct',
                ineligibilityReason:
                  MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
              }),
            });
            mockEligibilityRequestApi({
              response: new MockEligibilityResponse({
                typeOfCareId: 'clinicalPharmacyPrimaryCare',
                type: 'request',
                ineligibilityReason:
                  MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
              }),
            });
            mockRelationshipsApi({ response: [] });
            mockSchedulingConfigurationApi({
              facilityIds: ['983'],
              typeOfCareId: 'clinicalPharmacyPrimaryCare',
              isDirect: true,
              isRequest: true,
            });

            // Act
            cy.login(mockUser);

            AppointmentListPageObject.visit().scheduleAppointment();

            TypeOfCarePageObject.assertUrl()
              .assertAddressAlert({ exist: false })
              .selectTypeOfCare(/Pharmacy/i)
              .clickNextButton();

            VAFacilityPageObject.assertUrl().clickNextButton();

            // Wait for eligibility APIs to complete
            cy.wait([
              '@v2:get:eligibility:direct',
              '@v2:get:eligibility:request',
            ]);

            // Should stay on facility page and show ineligibility alert
            cy.url().should('include', '/location');
            cy.get('va-alert[status="warning"]')
              .should('exist')
              .and('be.visible');
            cy.get('va-alert[status="warning"] h2')
              .invoke('text')
              .should('match', /You can.t schedule this appointment online/i);

            // Assert
            cy.axeCheckBestPractice();
          });
        });
      });

      describe('And type of care is food and nutrition', () => {
        describe('And direct and request schedule is disabled', () => {
          it('should display ineligibility alert when not eligible for direct or request scheduling', () => {
            // Arrange
            const mockUser = new MockUser({
              addressLine1: '123 Main St.',
            });
            mockFacilitiesApi({
              response: [new MockFacilityResponse()],
            });
            mockEligibilityCCApi({
              cceType: nutritionCceType,
              isEligible: false,
            });
            mockEligibilityDirectApi({
              response: new MockEligibilityResponse({
                typeOfCareId: 'foodAndNutrition',
                type: 'direct',
                ineligibilityReason:
                  MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
              }),
            });
            mockEligibilityRequestApi({
              response: new MockEligibilityResponse({
                typeOfCareId: 'foodAndNutrition',
                type: 'request',
                ineligibilityReason:
                  MockEligibilityResponse.FACILITY_REQUEST_LIMIT_EXCEEDED,
              }),
            });
            mockRelationshipsApi({ response: [] });
            mockSchedulingConfigurationApi({
              facilityIds: ['983'],
              typeOfCareId: 'foodAndNutrition',
              isDirect: true,
              isRequest: true,
            });

            // Act
            cy.login(mockUser);

            AppointmentListPageObject.visit().scheduleAppointment();

            TypeOfCarePageObject.assertUrl()
              .assertAddressAlert({ exist: false })
              .selectTypeOfCare(/Nutrition and food/i)
              .clickNextButton();

            VAFacilityPageObject.assertUrl().clickNextButton();

            // Wait for eligibility APIs to complete
            cy.wait([
              '@v2:get:eligibility:direct',
              '@v2:get:eligibility:request',
            ]);

            // Should stay on facility page and show ineligibility alert
            cy.url().should('include', '/location');
            cy.get('va-alert[status="warning"]')
              .should('exist')
              .and('be.visible');
            cy.get('va-alert[status="warning"] h2')
              .invoke('text')
              .should('match', /You can.t schedule this appointment online/i);

            // Assert
            cy.axeCheckBestPractice();
          });
        });
      });
    });
  });
});
