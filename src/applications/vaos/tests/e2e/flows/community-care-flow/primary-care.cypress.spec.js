import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockCCProvidersApi,
  mockClinicApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockEligibilityCCApi,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import { MockUser } from '../../fixtures/MockUser';
import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import RequestDatePageObject from '../../page-objects/RequestDatePageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';

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
      mockCCProvidersApi();
      mockClinicApi({ locations: ['983'] });
      mockEligibilityApi({ isEligible: true });
      mockEligibilityCCApi({ typeOfCare: 'PrimaryCare', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: 'primaryCare',
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
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
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
});
