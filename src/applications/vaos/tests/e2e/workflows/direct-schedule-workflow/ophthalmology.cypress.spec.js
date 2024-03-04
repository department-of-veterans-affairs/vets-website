// @ts-check
import moment from 'moment';
import {
  APPOINTMENT_STATUS,
  OPHTHALMOLOGY_ID,
} from '../../../../utils/constants';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import {
  mockAppointmentGetApi,
  mockAppointmentCreateApi,
  mockAppointmentsGetApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
  mockEligibilityCCApi,
  mockClinicsApi,
  mockSlotsApi,
} from '../../vaos-cypress-helpers';
import MockUser from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import TypeOfEyeCarePageObject from '../../page-objects/TypeOfEyeCarePageObject';
import MockClinicResponse from '../../fixtures/MockClinicResponse';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import MockSlotResponse from '../../fixtures/MockSlotResponse';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import { getTypeOfCareById } from '../../../../utils/appointment';

const typeOfCareId = getTypeOfCareById(OPHTHALMOLOGY_ID).idV2;
const { cceType } = getTypeOfCareById(OPHTHALMOLOGY_ID);

describe('VAOS request schedule flow - Audiology', () => {
  beforeEach(() => {
    vaosSetup();

    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: moment(),
      status: APPOINTMENT_STATUS.booked,
      serviceType: typeOfCareId,
    });
    mockAppointmentGetApi({
      response,
    });
    mockAppointmentCreateApi({ response });
    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When veteran is CC eligible', () => {
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
      mockEligibilityCCApi({ cceType });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId,
        isDirect: true,
        isRequest: false,
      });
      mockSlotsApi({
        locationId: '983',
        clinicId: '1',
        response: MockSlotResponse.createResponses({
          startTimes: [moment().add(1, 'month')],
        }),
      });
    });

    describe('And more than one facility supports online scheduling', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Eye care.*/i)
          .clickNextButton();

        TypeOfEyeCarePageObject.assertUrl()
          .selectTypeOfEyeCare(/Ophthalmology/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i, false)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl()
          .selectClinic({ selection: /Clinic 1/i })
          .clickNextButton();

        PreferredDatePageObject.assertUrl()
          .typeDate()
          .clickNextButton();

        DateTimeSelectPageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl()
          .assertHeading({
            name: /Review your appointment details/i,
          })
          .assertHeading({
            level: 2,
            name: /You.re scheduling an ophthalmology appointment/i,
          })
          .clickConfirmButton();

        ConfirmationPageObject.assertUrl().assertText({
          text: /We’ve scheduled and confirmed your appointment/i,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
