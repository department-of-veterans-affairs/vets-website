/* eslint-disable no-new */
// @ts-check
import moment from 'moment';
import { MockUser } from '../../fixtures/MockUser';
import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import RequestDatePageObject from '../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
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
import { MockAppointment } from '../../fixtures/MockAppointment';

describe('VAOS community care flow using VAOS services', () => {
  beforeEach(() => {
    vaosSetup();

    const appt = new MockAppointment({
      id: 'mock1',
      localStartTime: moment(),
      status: 'proposed',
      serviceType: 'podiatry',
    });
    mockAppointmentApi({
      response: {
        ...appt,
      },
    });
    mockAppointmentsApi({ response: [] });
    mockAppointmentCreateApi();
    mockFacilitiesApi();
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports CC online scheduling', () => {
    beforeEach(() => {
      mockCCProvidersApi();
      mockEligibilityCCApi({ typeOfCare: 'Podiatry', isEligible: true });
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
        AppointmentListPage.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Podiatry/)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
          .validateHomeAddress(false)
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
      mockCCProvidersApi();
      mockEligibilityCCApi({ typeOfCare: 'Podiatry', isEligible: true });
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
        const mockUser = new MockUser().setAddress('123 Main St.');

        // Act
        cy.login(mockUser);
        AppointmentListPage.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Podiatry/)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
          .validateHomeAddress(true)
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

        AppointmentListPage.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Podiatry/)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
          .validateHomeAddress(false)
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

  describe('When veteran is not communtity care eligible', () => {
    it('should not submit form', () => {
      // Arrange
      mockEligibilityCCApi({ typeOfCare: 'Podiatry', isEligible: false });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: '411',
        isDirect: false,
        isRequest: false,
      });

      // Act
      cy.login(new MockUser());
      AppointmentListPage.visit().scheduleAppointment();

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
