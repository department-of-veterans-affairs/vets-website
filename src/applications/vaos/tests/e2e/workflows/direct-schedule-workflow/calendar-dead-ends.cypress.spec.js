// @ts-check
import moment from 'moment';
import MockSlotResponse from '../../fixtures/MockSlotResponse';
import MockUser from '../../fixtures/MockUser';
import {
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityApi,
  mockEligibilityCCApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import { PRIMARY_CARE } from '../../../../utils/constants';
import { getTypeOfCareById } from '../../../../utils/appointment';

const typeOfCareId = getTypeOfCareById(PRIMARY_CARE).idV2;
const { cceType } = getTypeOfCareById(PRIMARY_CARE);

describe('VAOS direct schedule flow - calendar dead ends', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When direct and request appointment schedule is enabled', () => {
    beforeEach(() => {
      const mockEligibilityResponse = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: true,
      });

      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityApi({ response: mockEligibilityResponse });
      mockEligibilityCCApi({ cceType, isEligible: false });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: true,
      });
    });

    describe('And clinic has no available appointment slots', () => {
      it('should display warning with link to start request flow', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/Clinic 1/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate({ date: moment() })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .assertWarningAlert({
            text: /We couldn.t find an appointment for your selected date/i,
          })
          .assertRequestLink();

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And user selects today (urgent care) as preferred date', () => {
      it('should display warning with link to start request flow', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: MockSlotResponse.createResponses({
            startTimes: [moment().add(1, 'day')],
          }),
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/Clinic 1/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate({ date: moment() })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .assertWarningAlert({
            text: /The earliest we can schedule your appointment is/i,
          })
          .assertRequestLink();

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And API call failed', () => {
      it('should display an error message', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          responseCode: 500,
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/Clinic 1/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate({ date: moment() })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .assertWarningAlert({
            text: /We couldn.t find an appointment for your selected date/i,
          })
          .assertErrorAlert({
            text: /We.ve run into a problem trying to find an appointment time/i,
          })
          .assertRequestLink();

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When direct is enabled and request is disabled', () => {
    beforeEach(() => {
      const mockEligibilityResponse = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: true,
      });

      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityApi({ response: mockEligibilityResponse });
      mockEligibilityCCApi({ cceType, isEligible: false });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId: 'primaryCare',
        isDirect: true,
        isRequest: false,
      });
    });

    describe('And user preferred date is tomorrow or later and clinic has no available appointment slots', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: [],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/Clinic 1/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate({ date: moment() })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .assertWarningAlert({
            text: /We couldn.t find an appointment for your selected date/i,
          })
          .assertRequestLink({ exist: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And user selects today (urgent care) as preferred date', () => {
      it('should display warning', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          response: MockSlotResponse.createResponses({
            startTimes: [moment().add(1, 'day')],
          }),
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/Clinic 1/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate({ date: moment() })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .assertWarningAlert({
            text: /The earliest we can schedule your appointment is/i,
          })
          .assertRequestLink({ exist: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });

    describe('And API call failed', () => {
      it('should display an error message', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });
        mockSlotsApi({
          locationId: '983',
          clinicId: '1',
          responseCode: 500,
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Primary care/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectRadioButton(/Clinic 1/i)
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate({ date: moment() })
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .assertWarningAlert({
            text: /We couldn.t find an appointment for your selected date/i,
          })
          .assertErrorAlert({
            text: /We.ve run into a problem trying to find an appointment time/i,
          })
          .assertRequestLink({ exist: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
