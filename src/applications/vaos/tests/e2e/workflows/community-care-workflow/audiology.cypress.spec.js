// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockProviderResponse from '../../../fixtures/MockProviderResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import AudiologyPageObject from '../../page-objects/AudiologyPageObject';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockCCProvidersApi,
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
  TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
);

describe('VAOS community care flow - Audiology', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When veteran is not CC eligible', () => {
    beforeEach(() => {
      const mockEligibilityResponseDirect = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: false,
        type: 'direct',
        ineligibilityReason:
          MockEligibilityResponse.PATIENT_HISTORY_INSUFFICIENT,
      });
      const mockEligibilityResponseRequest = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: true,
        type: 'request',
      });
      mockEligibilityDirectApi({
        response: mockEligibilityResponseDirect,
      });
      mockEligibilityRequestApi({
        response: mockEligibilityResponseRequest,
      });

      mockEligibilityCCApi({ cceType, isEligible: false });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId,
        isDirect: false,
        isRequest: true,
      });
    });

    it('should start appointment request flow', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({ count: 2 }),
      });

      // Act
      cy.login(mockUser);

      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/Audiology and speech/)
        .clickNextButton();

      VAFacilityPageObject.assertUrl()
        .assertSingleLocation({ locationName: /Facility 983/i })
        .clickNextButton();

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('When veteran is CC eligible', () => {
    beforeEach(() => {
      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: new Date(),
        status: 'proposed',
      }).setTypeOfCare('audiology');
      mockAppointmentGetApi({
        response,
      });
      mockAppointmentCreateApi({ response });
    });

    describe('When one facility supports CC online scheduling', () => {
      beforeEach(() => {
        mockCCProvidersApi({
          response: MockProviderResponse.createResponses(),
        });
        mockEligibilityCCApi({ cceType });
        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983'],
          }),
        });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      });

      describe('And veteran does have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Audiology and speech/)
            .clickNextButton();

          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/Community care facility/i)
            .clickNextButton();

          AudiologyPageObject.assertUrl()
            .assertAudiologyValidationErrors()
            .selectTypeOfCare(/Routine hearing exam/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl({ isVARequest: false })
            .selectFirstAvailableDate()
            .clickNextButton();

          CommunityCarePreferencesPageObject.assertUrl()
            .assertHeading({ name: /Which provider do you prefer/i })
            .expandAccordian()
            .assertHomeAddress()
            .selectProvider({ label: /Routine hearing exam providers/i })
            .clickNextButton();

          PreferredLanguagePageObject.assertUrl()
            .selectLanguage('english')
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl().clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typePhoneNumber('5555555555')
            .selectPreferredTime()
            .typeEmailAddress('user@va.gov')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();
          cy.wait('@v2:get:appointment');

          ConfirmationPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert()
            .selectTypeOfCare(/Audiology and speech/)
            .clickNextButton();

          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/Community care facility/i)
            .clickNextButton();

          AudiologyPageObject.assertUrl()
            .selectTypeOfCare(/Routine hearing exam/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl({ isVARequest: false })
            .selectFirstAvailableDate()
            .clickNextButton();

          CommunityCarePreferencesPageObject.assertUrl()
            .assertHeading({ name: /Which provider do you prefer/i })
            .expandAccordian()
            .assertHomeAddress({ exist: false })
            .selectProvider({ label: /Routine hearing exam providers/i })
            .clickNextButton();

          PreferredLanguagePageObject.assertUrl()
            .selectLanguage('english')
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl().clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typePhoneNumber('5555555555')
            .selectPreferredTime()
            .typeEmailAddress('user@va.gov')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();
          cy.wait('@v2:get:appointment');

          ConfirmationPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('When more than one facility supports CC online scheduling', () => {
      beforeEach(() => {
        mockCCProvidersApi({
          response: MockProviderResponse.createResponses(),
        });
        mockEligibilityCCApi({ cceType });
        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      });

      describe('And veteran does have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();
          mockUser.setAddress('123 Main St.');

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Audiology and speech/)
            .clickNextButton();

          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/Community care facility/i)
            .clickNextButton();

          AudiologyPageObject.assertUrl()
            .selectTypeOfCare(/Routine hearing exam/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl({ isVARequest: false })
            .selectFirstAvailableDate()
            .clickNextButton();

          ClosestCityStatePageObject.assertUrl()
            .selectFacility({ label: /City 983/i })
            .clickNextButton();

          CommunityCarePreferencesPageObject.assertUrl()
            .assertHeading({ name: /Which provider do you prefer/i })
            .expandAccordian()
            .assertHomeAddress()
            .selectProvider({ label: /Routine hearing exam providers/i })
            .clickNextButton();

          PreferredLanguagePageObject.assertUrl()
            .selectLanguage('english')
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl().clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typePhoneNumber('5555555555')
            .selectPreferredTime()
            .typeEmailAddress('user@va.gov')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();
          cy.wait('@v2:get:appointment');

          ConfirmationPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert()
            .selectTypeOfCare(/Audiology and speech/)
            .clickNextButton();

          TypeOfFacilityPageObject.assertUrl()
            .selectTypeOfFacility(/Community care facility/i)
            .clickNextButton();

          AudiologyPageObject.assertUrl()
            .selectTypeOfCare(/Routine hearing exam/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl({ isVARequest: false })
            .selectFirstAvailableDate()
            .clickNextButton();

          ClosestCityStatePageObject.assertUrl()
            .selectFacility({ label: /City 983/i })
            .clickNextButton();

          CommunityCarePreferencesPageObject.assertUrl()
            .assertHeading({ name: /Which provider do you prefer/i })
            .expandAccordian()
            .assertHomeAddress({ exist: false })
            .selectProvider({ label: /Routine hearing exam providers/i })
            .clickNextButton();

          PreferredLanguagePageObject.assertUrl()
            .selectLanguage('english')
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl().clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typePhoneNumber('5555555555')
            .selectPreferredTime()
            .typeEmailAddress('user@va.gov')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();
          cy.wait('@v2:get:appointment');

          ConfirmationPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });
});
