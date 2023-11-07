// @ts-check
import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockEligibilityCCApi,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import { MockUser } from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import { MockProvider } from '../../fixtures/MockProvider';

describe('VAOS community care flow - Primary care', () => {
  beforeEach(() => {
    vaosSetup();

    const appt = new MockAppointment({
      id: 'mock1',
      localStartTime: moment(),
      status: APPOINTMENT_STATUS.proposed,
      serviceType: 'primaryCare',
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
      mockEligibilityCCApi({ typeOfCare: 'PrimaryCare', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: 'primaryCare',
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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
      mockEligibilityCCApi({ typeOfCare: 'PrimaryCare', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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

  describe('When no providers within 60 miles', () => {
    beforeEach(() => {
      mockEligibilityCCApi({ typeOfCare: 'PrimaryCare', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });
    });

    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockCCProvidersApi({ response: [] });

      // Act
      cy.login(mockUser);
      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/Primary care/i)
        .clickNextButton();

      TypeOfFacilityPageObject.assertUrl()
        .selectTypeOfFacility(/Community care facility/i)
        .clickNextButton();

      DateTimeRequestPageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityStatePageObject.assertUrl()
        .selectFacility()
        .clickNextButton();

      CommunityCarePreferencesPageObject.assertUrl()
        .expandAccordian()
        .assertInfoAlert();

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('When browser blocked from finding location', () => {
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockCCProvidersApi({ response: [] });
      mockEligibilityCCApi({ typeOfCare: 'PrimaryCare', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });

      // Act
      cy.login(mockUser);
      AppointmentListPageObject.visit('/', {
        onBeforeLoad: ({ navigator }) => {
          navigator.permissions.query({ name: 'geolocation' }).then(result => {
            // eslint-disable-next-line no-console
            console.log(result);
          });
          cy.stub(navigator.geolocation, 'getCurrentPosition', () => {
            throw new Error(
              'Mock Error! Your browser is blocked from finding your current location.',
            );
          });
        },
      }).scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/Primary care/i)
        .clickNextButton();

      TypeOfFacilityPageObject.assertUrl()
        .selectTypeOfFacility(/Community care facility/i)
        .clickNextButton();

      DateTimeRequestPageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityStatePageObject.assertUrl()
        .selectFacility()
        .clickNextButton();

      CommunityCarePreferencesPageObject.assertUrl()
        .expandAccordian()
        .selectCurrentLocation()
        .assertWarningAlert();

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
