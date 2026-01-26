// @ts-check
import { addMonths } from 'date-fns';
import { getTypeOfCareById } from '../../../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  INELIGIBILITY_CODES_VAOS,
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
import TypeOfMentalHealthPageObject from '../../page-objects/TypeOfMentalHealthPageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockClinicsApi,
  mockEligibilityDirectApi,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockSlotsApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import TypeOfVisitPageObject from '../../page-objects/TypeOfVisitPageObject';

const labelRegexReasonForAppointment = /Enter a brief reason for this appointment\. Your provider will contact you if they need more details\./;
const typeOfCareRegex = /Mental health/i;

describe('VAOS request schedule flow - Mental health', () => {
  describe('When patient chooses mental health care with a specialist', () => {
    const { idV2: typeOfCareId } = getTypeOfCareById(
      TYPE_OF_CARE_IDS.MENTAL_HEALTH_SERVICES_ID,
    );

    describe('And patient has no history and flipper for MH past filtering is enabled', () => {
      beforeEach(() => {
        vaosSetup();

        const response = new MockAppointmentResponse({
          id: 'mock1',
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.proposed,
          pending: true,
        }).setType('REQUEST');
        mockAppointmentGetApi({ response });
        mockAppointmentCreateApi({ response });
        mockAppointmentsGetApi({ response: [] });
        mockFeatureToggles();
        mockVamcEhrApi();
      });

      describe('And one facility supports requesting with no history required', () => {
        const setup = () => {
          const mockEligibilityDirect = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
            isEligible: false,
            ineligibilityReason:
              INELIGIBILITY_CODES_VAOS.DIRECT_SCHEDULING_DISABLED,
          });
          const mockEligibilityRequest = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
            isEligible: true,
          });

          mockFacilitiesApi({
            response: MockFacilityResponse.createResponses({
              facilityIds: ['983'],
            }),
          });
          mockEligibilityDirectApi({ response: mockEligibilityDirect });
          mockEligibilityRequestApi({ response: mockEligibilityRequest });

          mockSchedulingConfigurationApi({
            facilityIds: ['983'],
            typeOfCareId,
            isDirect: true,
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

          TypeOfMentalHealthPageObject.assertUrl()
            .selectTypeOfMentalHealth(/Mental health care with a specialist/i)
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
            .assertLabel({
              label: labelRegexReasonForAppointment,
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

  describe('When patient chooses substance use problem services', () => {
    const { idV2: typeOfCareId } = getTypeOfCareById(
      TYPE_OF_CARE_IDS.MENTAL_HEALTH_SUBSTANCE_USE_ID,
    );

    describe('And patient has no history and flipper for MH past filtering is enabled', () => {
      beforeEach(() => {
        vaosSetup();

        const response = new MockAppointmentResponse({
          id: 'mock1',
          localStartTime: new Date(),
          status: APPOINTMENT_STATUS.proposed,
          pending: true,
        }).setType('REQUEST');
        mockAppointmentGetApi({ response });
        mockAppointmentCreateApi({ response });
        mockAppointmentsGetApi({ response: [] });
        mockFeatureToggles();
        mockVamcEhrApi();
      });

      describe('And one facility supports requesting with no history required', () => {
        const setup = () => {
          const mockEligibilityDirect = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
            isEligible: false,
            ineligibilityReason:
              INELIGIBILITY_CODES_VAOS.DIRECT_SCHEDULING_DISABLED,
          });
          const mockEligibilityRequest = new MockEligibilityResponse({
            facilityId: '983',
            typeOfCareId,
            isEligible: true,
          });

          mockFacilitiesApi({
            response: MockFacilityResponse.createResponses({
              facilityIds: ['983'],
            }),
          });
          mockEligibilityDirectApi({
            response: mockEligibilityDirect,
          });
          mockEligibilityRequestApi({
            response: mockEligibilityRequest,
          });

          mockSchedulingConfigurationApi({
            facilityIds: ['983'],
            typeOfCareId,
            isDirect: true,
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

          TypeOfMentalHealthPageObject.assertUrl()
            .selectTypeOfMentalHealth(/Substance use problem services/i)
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
            .assertLabel({
              label: labelRegexReasonForAppointment,
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
});
