// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockProviderResponse from '../../../fixtures/MockProviderResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
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
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockCCProvidersApi,
  mockEligibilityCCApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const { idV2: typeOfCareId, cceType } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.PRIMARY_CARE,
);

describe('VAOS community care flow - Primary care', () => {
  beforeEach(() => {
    vaosSetup();

    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: new Date(),
      status: APPOINTMENT_STATUS.proposed,
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
          .assertTypeOfFacilityValidationErrors()
          .selectTypeOfFacility(/Community care facility/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl({ isVARequest: false })
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .assertHeading({ name: /Which provider do you prefer/i })
          .expandAccordian()
          .assertHomeAddress()
          .selectProvider({ label: /Primary care providers/i })
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .assertHeading({ name: /What language do you prefer/i })
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl({ isVARequest: false })
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .assertHeading({ name: /Which provider do you prefer/i })
          .expandAccordian()
          .assertHomeAddress({ exist: false })
          .selectProvider({ label: /Primary care providers/i })
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .assertHeading({ name: /What language do you prefer/i })
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
          .assertClosestCityStateValidationErrors()
          .assertHeading({ name: /What.s the nearest city to you/i })
          .selectFacility({ label: /City 983/i })
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .assertHeading({ name: /Which provider do you prefer/i })
          .expandAccordian()
          .assertHomeAddress()
          .selectProvider({ label: /Primary care providers/i })
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .assertHeading({ name: /What language do you prefer/i })
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl({ isVARequest: false })
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityStatePageObject.assertUrl()
          .assertHeading({ name: /What.s the nearest city to you/i })
          .selectFacility({ label: /City 983/i })
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .assertHeading({ name: /Which provider do you prefer/i })
          .expandAccordian()
          .assertHomeAddress({ exist: false })
          .selectProvider({ label: /Primary care providers/i })
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .assertHeading({ name: /What language do you prefer/i })
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
        .assertHeading({ name: /What.s the nearest city to you/i })
        .selectFacility({ label: /City 983/i })
        .clickNextButton();

      CommunityCarePreferencesPageObject.assertUrl()
        .assertHeading({ name: /Which provider do you prefer/i })
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
        .assertHeading({ name: /What.s the nearest city to you/i })
        .selectFacility({ label: /City 983/i })
        .clickNextButton();

      CommunityCarePreferencesPageObject.assertUrl()
        .assertHeading({ name: /Which provider do you prefer/i })
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
