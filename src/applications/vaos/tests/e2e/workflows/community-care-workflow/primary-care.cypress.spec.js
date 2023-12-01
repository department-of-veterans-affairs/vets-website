// @ts-check
import moment from 'moment';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
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
import MockUser from '../../fixtures/MockUser';
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
import { APPOINTMENT_STATUS, PRIMARY_CARE } from '../../../../utils/constants';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import MockProviderResponse from '../../fixtures/MockProviderResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import { getTypeOfCareById } from '../../../../utils/appointment';

const { cceType } = getTypeOfCareById(PRIMARY_CARE);
const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;

describe('VAOS community care flow - Primary care', () => {
  beforeEach(() => {
    vaosSetup();

    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: moment(),
      status: APPOINTMENT_STATUS.proposed,
      serviceType: 'primaryCare',
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
      mockCCProvidersApi({ response: MockProviderResponse.createResponses() });
      mockEligibilityCCApi({ cceType });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId,
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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
      mockCCProvidersApi({ response: MockProviderResponse.createResponses() });
      mockEligibilityCCApi({ cceType });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId,
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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

  describe('When no providers within 60 miles', () => {
    beforeEach(() => {
      mockEligibilityCCApi({ cceType });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId,
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

      DateTimeRequestPageObject.assertUrl({ isVARequest: false })
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityStatePageObject.assertUrl()
        .selectFacility({ label: /City 983/i })
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
      mockEligibilityCCApi({ cceType });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId,
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

      DateTimeRequestPageObject.assertUrl({ isVARequest: false })
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityStatePageObject.assertUrl()
        .selectFacility({ label: /City 983/i })
        .clickNextButton();

      CommunityCarePreferencesPageObject.assertUrl()
        .expandAccordian()
        .selectCurrentLocation()
        .assertWarningAlert({
          text: /Your browser is blocked from finding your current location/i,
        });

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
