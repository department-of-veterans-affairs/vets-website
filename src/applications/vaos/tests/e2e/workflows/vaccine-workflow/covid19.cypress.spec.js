// @ts-check
import { addDays } from 'date-fns';
import { TYPE_OF_CARE_IDS } from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockSlotResponse from '../../../fixtures/MockSlotResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactFacilityPageObject from '../../page-objects/ContactFacilityPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import DosesReceivedPageObject from '../../page-objects/DosesReceivedPageObject';
import PlanAheadPageObject from '../../page-objects/PlanAheadPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import SecondDosePageObject from '../../page-objects/SecondDosePageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('VAOS covid-19 vaccine flow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFacilityApi({ id: '983' });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe.skip('When more than one facility supports online scheduling', () => {
    const setup = () => {
      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: new Date(),
        status: 'booked',
        future: true,
      }).setTypeOfCare(TYPE_OF_CARE_IDS.COVID_VACCINE_ID);

      mockAppointmentCreateApi({ response });
      mockAppointmentGetApi({
        response: {
          ...response,
          attributes: {
            ...response.attributes,
            clinic: '308',
            locationId: '983',
          },
        },
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        // Add one day since same day appointments are not allowed.
        response: MockSlotResponse.createResponses({
          startTimes: [addDays(new Date(), 1)],
        }),
      });
    };

    describe.skip('And veteran does have a home address', () => {
      beforeEach(setup);

      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            locationId: '983',
            count: 2,
          }),
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
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i, isCovid: true })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        SecondDosePageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typePhoneNumber('5555555555')
          .typeEmailAddress('user@va.gov')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl();
        cy.findByText('We’ve scheduled and confirmed your appointment.');

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe.skip('And veteran does not have a home address', () => {
      beforeEach(setup);

      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            locationId: '983',
            count: 2,
          }),
        });

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
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i, isCovid: true })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        SecondDosePageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typePhoneNumber('5555555555')
          .typeEmailAddress('user@va.gov')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl();
        cy.findByText('We’ve scheduled and confirmed your appointment.');

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe.skip('When one facility supports online scheduling', () => {
    const setup = () => {
      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: new Date(),
        status: 'booked',
        future: true,
      }).setTypeOfCare(TYPE_OF_CARE_IDS.COVID_VACCINE_ID);

      mockAppointmentCreateApi({ response });
      mockAppointmentGetApi({
        response: {
          ...response,
          attributes: {
            ...response.attributes,
            clinic: '308',
            locationId: '983',
          },
        },
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        // Add one day since same day appointments are not allowed.
        response: MockSlotResponse.createResponses({
          startTimes: [addDays(new Date(), 1)],
        }),
      });
    };

    describe.skip('And veteran does have a home address', () => {
      beforeEach(setup);

      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });
        mockUser.setAddress('123 Main St.');

        // Create 1 facility and clinic that supports online scheduling
        const mockFacility = new MockFacilityResponse();
        mockFacilitiesApi({ response: [mockFacility] });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            locationId: '983',
            count: 2,
          }),
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
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
            isVA: false,
          })
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i, isCovid: true })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        SecondDosePageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typePhoneNumber('5555555555')
          .typeEmailAddress('user@va.gov')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl();
        cy.findByText('We’ve scheduled and confirmed your appointment.');

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe.skip('And veteran does not have a home address', () => {
      beforeEach(setup);

      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();

        // Create 1 facility and clinic that supports online scheduling
        const mockFacility = new MockFacilityResponse();
        mockFacilitiesApi({ response: [mockFacility] });
        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({
            locationId: '983',
            count: 2,
          }),
        });

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
          .assertSingleLocation({
            locationName: /Cheyenne VA Medical Center/i,
            isVA: false,
          })
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i, isCovid: true })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        SecondDosePageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typePhoneNumber('5555555555')
          .typeEmailAddress('user@va.gov')
          .clickNextButton();

        ReviewPageObject.assertUrl().clickConfirmButton();

        ConfirmationPageObject.assertUrl();
        cy.findByText('We’ve scheduled and confirmed your appointment.');

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When veteran selects "Yes" on received dose screener page', () => {
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
          count: 2,
        }),
      });

      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
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

  describe('When site is configured for covid but no locations are found', () => {
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockClinicsApi({
        locationId: '983',
        response: [],
      });

      mockFacilitiesApi({
        response: [],
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
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
        .assertWarningAlert({
          text: /We couldn.t find a VA facility where you receive care that accepts online appointments for COVID-19 vaccines/i,
        })
        .assertNextButton({ isEnabled: false });

      // Assert
      cy.axeCheckBestPractice();
    });
  });

  describe('When sites is not configured for covid', () => {
    // TODO: Consult with Peter. Alert is not displayed.
    it('should display alert', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockClinicsApi({
        locationId: '983',
        response: [],
      });

      mockFacilitiesApi({
        response: [],
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        // Site not configured for 'covid'
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        isDirect: false,
        isRequest: false,
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
    it.skip('should display 500 error message', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockAppointmentCreateApi({ responseCode: 500 });
      mockClinicsApi({
        locationId: '983',
        response: MockClinicResponse.createResponses({
          locationId: '983',
          count: 2,
        }),
      });

      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        isDirect: true,
        isRequest: true,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        response: MockSlotResponse.createResponses({
          // Add one day since same day appointments are not allowed.
          startTimes: [addDays(new Date(), 1)],
        }),
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
        .selectLocation(/Facility 983/i)
        .clickNextButton();

      ClinicChoicePageObject.assertUrl()
        .selectClinic({ selection: /Clinic 1/i, isCovid: true })
        .clickNextButton();

      DateTimeSelectPageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      SecondDosePageObject.assertUrl().clickNextButton();

      ContactInfoPageObject.assertUrl()
        .typePhoneNumber('5555555555')
        .typeEmailAddress('user@va.gov')
        .clickNextButton();

      ReviewPageObject.assertUrl().clickConfirmButton();

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
