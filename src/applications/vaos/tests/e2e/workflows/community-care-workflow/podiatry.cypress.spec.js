// @ts-check
import moment from 'moment';
import MockUser from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentGetApi,
  mockAppointmentCreateApi,
  mockAppointmentsGetApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockEligibilityCCApi,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import MockProviderResponse from '../../fixtures/MockProviderResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import { getTypeOfCareById } from '../../../../utils/appointment';
import { PODIATRY_ID } from '../../../../utils/constants';

const { cceType } = getTypeOfCareById(PODIATRY_ID);

describe('VAOS community care flow - Podiatry', () => {
  describe('When veteran is CC eligible', () => {
    beforeEach(() => {
      vaosSetup();

      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: moment(),
        status: 'proposed',
        serviceType: 'podiatry',
      });
      mockAppointmentGetApi({
        response,
      });
      mockAppointmentsGetApi({ response: [] });
      mockAppointmentCreateApi({ response });
      mockFeatureToggles();
      mockVamcEhrApi();
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
          typeOfCareId: '411',
          isDirect: true,
          isRequest: true,
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
            .selectTypeOfCare(/Podiatry/)
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
          typeOfCareId: '411',
          isDirect: true,
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
            .selectTypeOfCare(/Podiatry/)
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
            .selectTypeOfCare(/Podiatry/)
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

  describe('When veteran is not CC eligible and podiatry is selected', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsGetApi({ response: [] });
      mockFeatureToggles();
      mockVamcEhrApi();
    });

    it('should display alert', () => {
      // Arrange
      mockEligibilityCCApi({ cceType, isEligible: false });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: '411',
        isDirect: false,
        isRequest: false,
      });

      // Act
      cy.login(new MockUser());
      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .selectTypeOfCare(/Podiatry/)
        .clickNextButton();

      // Assert
      cy.get('#toc-modal')
        .shadow()
        .contains(
          /You need to call your VA facility for a Podiatry appointment/i,
        );

      cy.axeCheckBestPractice();
    });
  });
});
