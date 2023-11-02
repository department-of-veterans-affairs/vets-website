// @ts-check
// Inteligent code
/// <reference types="cypress" />

import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockClinicsApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import { MockUser } from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import PlanAheadPageObject from '../../page-objects/PlanAheadPageObject';
import DosesReceivedPageObject from '../../page-objects/DosesReceivedPageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import SecondDosePageObject from '../../page-objects/SecondDosePageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';

describe('VAOS covid-19 vaccine flow', () => {
  beforeEach(() => {
    vaosSetup();

    const appt = new MockAppointment({
      id: 'mock1',
      localStartTime: moment(),
      status: 'booked',
      serviceType: 'covid',
    });
    mockAppointmentApi({
      response: {
        ...appt,
        attributes: { ...appt.attributes, clinic: '308', locationId: '983' },
      },
    });
    mockAppointmentCreateApi();
    mockAppointmentsApi({ response: [] });
    mockFacilitiesApi({ apiVersion: 2 });
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports online scheduling', () => {
    beforeEach(() => {
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });
    });

    describe('And veteran does have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();
        mockUser.setAddress('123 Main St.');

        mockClinicsApi({ locations: ['983'], apiVersion: 2 });

        // TODO: May move this to the clinic choice page object since the clinic id
        // will be known at that point
        // mockDirectScheduleSlotsApi({ clinicId: '308', apiVersion: 2 });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert(false)
          .selectTypeOfCare(/COVID-19 vaccine/i)
          .clickNextButton();

        PlanAheadPageObject.assertUrl().clickNextButton();

        DosesReceivedPageObject.assertUrl()
          // .selectRadioButton(/Yes/i)
          .selectRadioButton(/No\/I.m not sure/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Cheyenne VA Medical Center/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic(/Green Team Clinic1/i, true)
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl({
          isCovid: true,
        })
          .selectFirstAvailableDate()
          .clickNextButton();

        SecondDosePageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typePhoneNumber('5555555555')
          .typeEmailAddress('user@va.gov')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });
        cy.findByText('We’ve scheduled and confirmed your appointment.');
        // cy.findAllByText('COVID-19 vaccine');
        // cy.findByText('Clinic:');

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {});
    });
  });

  describe('When one facility supports online scheduling', () => {
    describe('And veteran does have a home address', () => {
      it('should submit form', () => {});
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {});
    });
  });

  describe('When one site is configured and no clinics are configured', () => {
    it('should display alert', () => {});
  });

  describe('When no sites are configured', () => {
    it('should display alert', () => {});
  });
});
