// @ts-check
import { addMonths, subDays } from 'date-fns';
import { getTypeOfCareById } from '../../../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockClinicResponse from '../../../fixtures/MockClinicResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockSlotResponse from '../../../fixtures/MockSlotResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ClinicChoicePageObject from '../../page-objects/ClinicChoicePageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeSelectPageObject from '../../page-objects/DateTimeSelectPageObject';
import PreferredDatePageObject from '../../page-objects/PreferredDatePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfEyeCarePageObject from '../../page-objects/TypeOfEyeCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityCCApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const typeOfCareId = getTypeOfCareById(TYPE_OF_CARE_IDS.OPHTHALMOLOGY_ID).idV2;
const { cceType } = getTypeOfCareById(TYPE_OF_CARE_IDS.OPHTHALMOLOGY_ID);

describe('VAOS request schedule flow - Audiology', () => {
  beforeEach(() => {
    vaosSetup();

    const yesterday = subDays(new Date(), 1);
    const responseOne = new MockAppointmentResponse({
      id: 'mock1',
      cancellable: false,
      localStartTime: yesterday,
      status: APPOINTMENT_STATUS.booked,
      typeOfCareId,
    }).setClinicId('1');
    const responseTwo = new MockAppointmentResponse({
      id: 'mock2',
      cancellable: false,
      localStartTime: yesterday,
      status: APPOINTMENT_STATUS.booked,
      typeOfCareId,
    }).setClinicId('2');

    mockAppointmentsGetApi({
      response: [responseOne, responseTwo],
    });

    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When veteran is CC eligible', () => {
    const setup = () => {
      const direct = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: true,
        type: 'direct',
      });

      const request = new MockEligibilityResponse({
        facilityId: '983',
        typeOfCareId,
        isEligible: false,
        ineligibilityReason: MockEligibilityResponse.REQUEST_DISABLED,
        type: 'request',
      });

      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: new Date(),
        startDate: new Date(),
        status: APPOINTMENT_STATUS.booked,
        future: true,
      });

      mockAppointmentCreateApi({ response });
      mockAppointmentGetApi({
        response,
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityCCApi({ cceType });
      mockEligibilityDirectApi({ response: direct });
      mockEligibilityRequestApi({ response: request });
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
          startTimes: [addMonths(new Date(), 1)],
        }),
      });
    };

    describe('And more than one facility supports online scheduling', () => {
      beforeEach(setup);

      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        mockClinicsApi({
          locationId: '983',
          response: MockClinicResponse.createResponses({ count: 2 }),
        });

        mockFacilityApi({
          id: '983',
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983'],
          })[0],
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Eye care.*/i)
          .clickNextButton();

        TypeOfEyeCarePageObject.assertUrl()
          .assertTypeOfEyeCareValidationErrors()
          .selectTypeOfEyeCare(/Ophthalmology/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .selectLocation(/Facility 983/i)
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
          .typeAdditionalText({ content: 'This is a test' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl()
          .assertHeading({
            name: /Review and confirm your appointment details/i,
          })
          .assertText({ text: /ophthalmology/i })
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
