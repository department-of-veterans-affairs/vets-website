// @ts-check
import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockCCProvidersApi,
  mockEligibilityCCApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
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
import { MockUser } from '../../fixtures/MockUser';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import AudiologyPageObject from '../../page-objects/AudiologyPageObject';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import { MockProvider } from '../../fixtures/MockProvider';

describe('VAOS community care flow - Audiology', () => {
  beforeEach(() => {
    vaosSetup();

    const appt = new MockAppointment({
      id: 'mock1',
      localStartTime: moment(),
      status: 'proposed',
      serviceType: 'audiology',
    });
    mockAppointmentApi({
      response: {
        ...appt,
      },
    });
    mockAppointmentsApi({ response: [] });
    mockAppointmentCreateApi();
    mockFacilitiesApi({ apiVersion: 2 });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports CC online scheduling', () => {
    beforeEach(() => {
      const mockProvider = new MockProvider();

      mockCCProvidersApi({ response: [{ ...mockProvider }] });
      mockEligibilityCCApi({ typeOfCare: 'Audiology', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
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
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Audiology and speech/)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
          .clickNextButton();

        AudiologyPageObject.assertUrl()
          .selectTypeOfCare(/Routine hearing exam/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl()
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

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

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

        DateTimeRequestPageObject.assertUrl()
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

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When more than one facility supports CC online scheduling', () => {
    beforeEach(() => {
      const mockProvider = new MockProvider();

      mockCCProvidersApi({ response: [{ ...mockProvider }] });
      mockEligibilityCCApi({ typeOfCare: 'Audiology', isEligible: true });
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

        DateTimeRequestPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityStatePageObject.assertUrl()
          .selectFacility()
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

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

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

        DateTimeRequestPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityStatePageObject.assertUrl()
          .selectFacility()
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

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
