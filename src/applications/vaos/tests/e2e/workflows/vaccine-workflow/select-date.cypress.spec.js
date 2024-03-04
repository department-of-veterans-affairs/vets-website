import moment from 'moment-timezone';
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import MockSlotResponse from '../../fixtures/MockSlotResponse';
import MockUser from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import DosesReceivedPageObject from '../../page-objects/DosesReceivedPageObject';
import PlanAheadPageObject from '../../page-objects/PlanAheadPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';

describe('VAOS select appointment date', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When selecting an appointment date', () => {
    beforeEach(() => {
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'covid',
        isDirect: true,
        isRequest: true,
      });
    });

    it('should allow a user to choose available slot and fetch new slots after changing clinics', () => {
      // Arrange
      // Add one day since same day appointments are not allowed.
      const firstDate = moment().add(1, 'day');
      const secondDate = moment()
        .tz('America/Denver')
        .add(2, 'day');
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });
      const response = MockSlotResponse.createResponses({
        startTimes: [firstDate, secondDate],
      });

      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        response,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '2',
        response,
      });

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
        .selectLocation(/Facility 983/i, false)
        .clickNextButton();

      ClinicChoicePageObject.assertUrl()
        .selectClinic({ selection: /Clinic 1/i, isCovid: true })
        .clickNextButton();

      DateTimeSelectPageObject.assertUrl()
        .selectFirstAvailableDate()
        .assertDateSelected(firstDate)
        .clickBackButton();

      ClinicChoicePageObject.assertUrl()
        .selectClinic({ selection: /Clinic 2/i, isCovid: true })
        .clickNextButton();

      DateTimeSelectPageObject.assertUrl()
        .selectDate(secondDate)
        .assertDateSelected(secondDate);

      // Assert
      cy.axeCheckBestPractice();
    });

    it('should display error message if slots call fails', () => {
      // Arrange
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });
      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        responseCode: 501,
      });

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
        .selectLocation(/Facility 983/i, false)
        .clickNextButton();

      ClinicChoicePageObject.assertUrl()
        .selectClinic({ selection: /Clinic 1/i, isCovid: true })
        .clickNextButton();

      DateTimeSelectPageObject.assertUrl()
        .assertErrorAlert({
          text: /We.ve run into a problem when trying to find available appointment times/i,
        })
        .assertNexButton({ label: 'Continue', isEnabled: false });

      // Assert
      cy.axeCheckBestPractice();
    });

    it('should fetch slots when moving between months', () => {
      // Arrange
      // Add one day since same day appointments are not allowed.
      const firstDate = moment().add(1, 'day');
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });
      const todayDate = moment().date();
      const endOfMonthDate = moment()
        .clone()
        .endOf('month')
        .date();

      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        response: MockSlotResponse.createResponses({
          startTimes: [firstDate],
        }),
      });

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
        .selectLocation(/Facility 983/i, false)
        .clickNextButton();

      ClinicChoicePageObject.assertUrl()
        .selectClinic({ selection: /Clinic 1/i, isCovid: true })
        .clickNextButton();

      DateTimeSelectPageObject.assertUrl()
        .clickNextMonth()
        .wait({ alias: '@v2:get:slots' })
        .assertCallCount({
          alias: '@v2:get:slots',
          count: todayDate < endOfMonthDate ? 2 : 3,
        });

      // Assert
      cy.axeCheckBestPractice();
    });

    it('should show validation error if no date selected', () => {
      // Arrange
      // Add one day since same day appointments are not allowed.
      const firstDate = moment().add(1, 'day');
      const mockUser = new MockUser({ addressLine1: '123 Main St.' });

      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        response: MockSlotResponse.createResponses({
          startTimes: [firstDate],
        }),
      });

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
        .selectLocation(/Facility 983/i, false)
        .clickNextButton();

      ClinicChoicePageObject.assertUrl()
        .selectClinic({ selection: /Clinic 1/i, isCovid: true })
        .clickNextButton();

      DateTimeSelectPageObject.assertUrl()
        .clickNextButton()
        .assertText({
          text: /Please choose your preferred date and time for your appointment/i,
        });

      // Assert
      cy.axeCheckBestPractice();
    });
  });
});
