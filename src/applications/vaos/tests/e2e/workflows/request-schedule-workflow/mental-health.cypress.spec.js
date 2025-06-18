// @ts-check
import { addMonths } from 'date-fns';
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
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import TypeOfVisitPageObject from '../../page-objects/TypeOfVisitPageObject';

const { idV2: typeOfCareId } = getTypeOfCareById(
  TYPE_OF_CARE_IDS.MENTAL_HEALTH,
);
const typeOfCareRegex = /Mental health/i;

describe('VAOS direct schedule flow - Mental health', () => {
  describe('When patient has no history and flipper for MH past filtering is enabled', () => {
    beforeEach(() => {
      vaosSetup();

      const response = new MockAppointmentResponse({
        id: 'mock1',
        localStartTime: new Date(),
        status: APPOINTMENT_STATUS.proposed,
      });
      mockAppointmentGetApi({ response });
      mockAppointmentCreateApi({ response });
      mockAppointmentsGetApi({ response: [] });
      mockFeatureToggles();
      mockVamcEhrApi();
    });

    describe('And one facility supports direct scheduling with no history required', () => {
      const setup = () => {
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: true,
        });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983'],
          }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      };
      // Not testing for appointment flow completeness, just that filtering MH
      // are correct.
      beforeEach(setup);

      it('should submit form', () => {
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
            startTimes: [addMonths(new Date(), 1)],
          }),
        });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(typeOfCareRegex)
          .clickNextButton();

        VAFacilityPageObject.assertUrl()
          .assertSingleLocation({ locationName: /Facility 983/i })
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl()
          .assertHeading({
            name: /When would you like an appointment/i,
          })
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .assertHeading({
            name: /What.s the reason for this appointment/i,
          })
          .selectReasonForAppointment()
          .assertLabel({
            label: /Add any details you.d like to share with your provider/,
          })
          .typeAdditionalText({
            content: 'This is a test',
          })
          .clickNextButton();

        TypeOfVisitPageObject.assertUrl()
          .assertHeading({
            name: /How do you want to attend this appointment/i,
          })
          .selectVisitType('In person')
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .assertHeading({
            name: /How should we contact you/i,
          })
          .typeEmailAddress('veteran@va.gov')
          .typePhoneNumber('5555555555')
          .clickNextButton();

        ReviewPageObject.assertUrl()
          .assertHeading({
            name: /Review and submit your request/,
          })
          .clickRequestButton();

        ConfirmationPageObject.assertUrl({
          isDirect: false,
        });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
