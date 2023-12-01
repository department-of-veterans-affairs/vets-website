// @ts-check
import moment from 'moment';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import {
  mockAppointmentGetApi,
  mockAppointmentCreateApi,
  mockAppointmentsGetApi,
  mockCCProvidersApi,
  mockEligibilityCCApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
  mockEligibilityApi,
  mockClinicsApi,
} from '../../vaos-cypress-helpers';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import MockUser from '../../fixtures/MockUser';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import AudiologyPageObject from '../../page-objects/AudiologyPageObject';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import MockProviderResponse from '../../fixtures/MockProviderResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import { getTypeOfCareById } from '../../../../utils/appointment';
import { AUDIOLOGY_ID } from '../../../../utils/constants';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import MockClinicResponse from '../../fixtures/MockClinicResponse';

const typeOfCareId = getTypeOfCareById(AUDIOLOGY_ID).idV2;
const { cceType } = getTypeOfCareById(AUDIOLOGY_ID);

describe('VAOS community care flow - Audiology', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When veteran is not CC eligible', () => {
    beforeEach(() => {
      const mockEligibilityResponse = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: false,
      });

      mockEligibilityApi({ response: mockEligibilityResponse });
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
        localStartTime: moment(),
        status: 'proposed',
        serviceType: 'audiology',
      });
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
            .selectTypeOfCare(/Routine hearing exam/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl({ isVARequest: false })
            .selectFirstAvailableDate()
            .clickNextButton();

          CommunityCarePreferencesPageObject.assertUrl()
            .expandAccordian()
            .assertHomeAddress()
            .selectProvider()
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

          ReviewPageObject.assertUrl().clickNextButton('Request appointment');
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
            .expandAccordian()
            .assertHomeAddress({ exist: false })
            .selectProvider()
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

          ReviewPageObject.assertUrl().clickNextButton('Request appointment');
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
            .expandAccordian()
            .assertHomeAddress()
            .selectProvider()
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

          ReviewPageObject.assertUrl().clickNextButton('Request appointment');
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
            .expandAccordian()
            .assertHomeAddress({ exist: false })
            .selectProvider()
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

          ReviewPageObject.assertUrl().clickNextButton('Request appointment');
          cy.wait('@v2:get:appointment');

          ConfirmationPageObject.assertUrl();

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });
});
