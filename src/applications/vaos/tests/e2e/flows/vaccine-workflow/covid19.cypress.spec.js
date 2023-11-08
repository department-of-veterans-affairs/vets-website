// @ts-check
// Inteligent code
/// <reference types="cypress" />

import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockClinicApi,
  mockClinicsApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
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
import ContactFacilityPageObject from '../../page-objects/ContactFacilityPageObject';
import { MockFacility } from '../../fixtures/MockFacility';
import { MockSlot } from '../../fixtures/MockSlot';

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
    mockAppointmentCreateApi({ response: appt });
    mockAppointmentsApi({ response: [] });
    mockFacilityApi({ id: '983', apiVersion: 2 });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When more than one facility supports online scheduling', () => {
    beforeEach(() => {
      // Add one day since same day appointments are not allowed.
      const mockSlot = new MockSlot({ id: 1, start: moment().add(1, 'day') });

      mockFacilitiesApi();
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '308',
        response: [mockSlot],
      });
    });

    describe('And veteran does have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({ locations: ['983'], apiVersion: 2 });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/COVID-19 vaccine/i)
          .clickNextButton();

        PlanAheadPageObject.assertUrl().clickNextButton();

        DosesReceivedPageObject.assertUrl()
          .selectRadioButton(/No\/I.m not sure/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertHomeAddress({ address: /123 Main St/i })
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

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();

        mockClinicsApi({ locations: ['983'], apiVersion: 2 });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert()
          .selectTypeOfCare(/COVID-19 vaccine/i)
          .clickNextButton();

        PlanAheadPageObject.assertUrl().clickNextButton();

        DosesReceivedPageObject.assertUrl()
          .selectRadioButton(/No\/I.m not sure/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertHomeAddress({ exist: false })
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

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When one facility supports online scheduling', () => {
    beforeEach(() => {
      // Add one day since same day appointments are not allowed.
      const mockSlot = new MockSlot({ id: 1, start: moment().add(1, 'day') });

      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '308',
        response: [mockSlot],
      });
    });

    describe('And veteran does have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        mockUser.setAddress('123 Main St.');

        // Create 1 facility and clinic that supports online scheduling
        const mockFacility = new MockFacility();
        mockFacilitiesApi({ response: [mockFacility] });
        mockClinicsApi({ locations: ['983'], apiVersion: 2 });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/COVID-19 vaccine/i)
          .clickNextButton();

        PlanAheadPageObject.assertUrl().clickNextButton();

        DosesReceivedPageObject.assertUrl()
          .selectRadioButton(/No\/I.m not sure/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertOneLocation({
            locationName: /Cheyenne VA Medical Center/i,
          })
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

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();

        // Create 1 facility and clinic that supports online scheduling
        const mockFacility = new MockFacility();
        mockFacilitiesApi({ response: [mockFacility] });
        mockClinicsApi({ locations: ['983'], apiVersion: 2 });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: true })
          .selectTypeOfCare(/COVID-19 vaccine/i)
          .clickNextButton();

        PlanAheadPageObject.assertUrl().clickNextButton();

        DosesReceivedPageObject.assertUrl()
          .selectRadioButton(/No\/I.m not sure/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertOneLocation({ locationName: /Cheyenne VA Medical Center/i })
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

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When user selects "Yes" on received dose screener page', () => {
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockClinicsApi({ locations: ['983'], apiVersion: 2 });
      mockFacilitiesApi();
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });

      // Act
      cy.login(mockUser);

      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/COVID-19 vaccine/i)
        .clickNextButton();

      PlanAheadPageObject.assertUrl().clickNextButton();

      DosesReceivedPageObject.assertUrl()
        .selectRadioButton(/Yes/i)
        .clickNextButton();

      ContactFacilityPageObject.assertUrl().assertWarningAlert();

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  // TODO: Update Figma diagram
  describe('When site is configured for covid but no locations are found', () => {
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      // Use any invalid clinic id to for an empty return from the api call.
      mockClinicApi({ locationId: '983', response: [] });
      mockFacilitiesApi();
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });

      // Act
      cy.login(mockUser);

      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/COVID-19 vaccine/i)
        .clickNextButton();

      PlanAheadPageObject.assertUrl().clickNextButton();

      DosesReceivedPageObject.assertUrl()
        .selectRadioButton(/No\/I.m not sure/i)
        .clickNextButton();

      VAFacilityPageObject.assertUrl({ axCheck: false })
        .selectLocation(/Cheyenne VA Medical Center/i)
        .clickNextButton();

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('When sites is not configured for covid', () => {
    // TODO: Consult with Peter. Alert is not displayed.
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockClinicsApi({ locations: ['983'], apiVersion: 2 });
      mockFacilitiesApi();
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        // Site not configured for 'covid'
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });

      // Act
      cy.login(mockUser);

      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/COVID-19 vaccine/i)
        .clickNextButton();

      ContactFacilityPageObject.assertUrl().assertText(
        /Contact one of your registered VA facilities to schedule your vaccine appointment/i,
      );

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('When appointment can not be scheduled', () => {
    it('should display 500 error message', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });
      // Add one day since same day appointments are not allowed.
      const mockSlot = new MockSlot({ id: 1, start: moment().add(1, 'day') });

      mockAppointmentCreateApi({ responseCode: 500 });
      mockClinicsApi({ locations: ['983'], apiVersion: 2 });
      mockFacilitiesApi();
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '308',
        response: [mockSlot],
      });

      // Act
      cy.login(mockUser);

      AppointmentListPageObject.visit().scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .assertAddressAlert({ exist: false })
        .selectTypeOfCare(/COVID-19 vaccine/i)
        .clickNextButton();

      PlanAheadPageObject.assertUrl().clickNextButton();

      DosesReceivedPageObject.assertUrl()
        .selectRadioButton(/No\/I.m not sure/i)
        .clickNextButton();

      VAFacilityPageObject.assertUrl()
        .assertHomeAddress({ address: /123 Main St/i })
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

      // ConfirmationPageObject.assertUrl({ apiVersion: 2 });
      // cy.findByText('We’ve scheduled and confirmed your appointment.');

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
