import { formatInTimeZone } from 'date-fns-tz';
import VerifyPageObject from './page-objects/VerifyPageObject';
import EnterOTPPageObject from './page-objects/EnterOTPPageObject';
import DateTimeSelectionPageObject from './page-objects/DateTimeSelectionPageObject';
import TopicSelectionPageObject from './page-objects/TopicSelectionPageObject';
import {
  mockRequestOtpApi,
  mockAuthenticateOtpApi,
  mockAppointmentAvailabilityApi,
  mockTopicsApi,
  mockCreateAppointmentApi,
  mockAppointmentDetailsApi,
  mockCancelAppointmentApi,
  patchCookiesForCI,
} from './vass-e2e-helpers';
import MockAppointmentAvailabilityResponse from '../fixtures/MockAppointmentAvailabilityResponse';
import MockAppointmentDetailsResponse from '../fixtures/MockAppointmentDetailsResponse';
import { createMockJwt } from '../../utils/mock-helpers';
import MockAuthenticateOtpResponse from '../fixtures/MockAuthenticateOtpResponse';
import ReviewPageObject from './page-objects/ReviewPageObject';
import ConfirmationPageObject from './page-objects/ConfirmationPageObject';
import CancelAppointmentPageObject from './page-objects/CancelAppointmentPageObject';
import CancelConfirmationPageObject from './page-objects/CancelConfirmationPageObject';
import AlreadyScheduledPageObject from './page-objects/AlreadyScheduledPageObject';
import { createAppointmentAlreadyBookedError } from '../../services/mocks/utils/errors';
import MockCancelAppointmentResponse from '../fixtures/MockCancelAppointmentResponse';

const uuid = 'c0ffee-1234-beef-5678';
const expiresIn = 3600;

// Fixed "today" for consistent calendar and slot selection (same pattern as VAOS referral-appointments)
const mockToday = new Date('2025-06-02T12:00:00Z');

describe('VASS Schedule Appointment', () => {
  beforeEach(() => {
    // Patch document.cookie so the VASS JWT cookie can be stored
    // in CI where the test server runs on http://127.0.0.1 (not HTTPS/va.gov)
    patchCookiesForCI();

    // Setup API mocks before visiting the page
    mockRequestOtpApi();

    const authenticateOtpResponse = new MockAuthenticateOtpResponse({
      token: createMockJwt(uuid, expiresIn),
      expiresIn,
    }).toJSON();
    mockAuthenticateOtpApi({
      response: authenticateOtpResponse,
      responseCode: 200,
    });
  });

  describe('Schedule Appointment', () => {
    beforeEach(() => {
      mockAppointmentAvailabilityApi();

      mockTopicsApi();

      mockCreateAppointmentApi();

      mockAppointmentDetailsApi();
      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
    });

    it('should schedule an appointment', () => {
      VerifyPageObject.assertVerifyPage();

      cy.injectAxeThenAxeCheck();

      VerifyPageObject.fillAndSubmitValidForm();

      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.assertEnterOTPPage();

      cy.injectAxeThenAxeCheck();
      EnterOTPPageObject.fillAndSubmitValidOTP();

      cy.wait('@vass:get:appointment-availability');
      DateTimeSelectionPageObject.assertDateTimeSelectionPage();
      cy.injectAxeThenAxeCheck();
      DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();

      cy.wait('@vass:get:topics');
      cy.injectAxeThenAxeCheck();
      TopicSelectionPageObject.assertTopicSelectionPage();
      TopicSelectionPageObject.selectTopicAndContinue('General VA benefits');

      ReviewPageObject.assertReviewPage();
      cy.injectAxeThenAxeCheck();
      ReviewPageObject.assertTopicDescription('General VA benefits');
      ReviewPageObject.clickConfirmAppointment();

      cy.wait('@vass:post:appointment');
      cy.injectAxeThenAxeCheck();
      cy.wait('@vass:get:appointment-details');

      ConfirmationPageObject.assertConfirmationPage({
        agentName: 'Agent Smith',
        topics: ['General VA benefits'],
      });
      cy.injectAxeThenAxeCheck();
      ConfirmationPageObject.assertAddToCalendarButton();
      ConfirmationPageObject.assertPrintFunctionality();
    });

    it('should allow the user to change the date and time', () => {
      const topic = 'General VA benefits';

      // Fixed slots for deterministic assertions (same day, two times)
      const firstSlotStart = '2025-06-03T13:00:00.000Z';
      const secondSlotStart = '2025-06-03T13:30:00.000Z';
      const firstSlot = MockAppointmentAvailabilityResponse.createSlot({
        dtStartUtc: firstSlotStart,
        dtEndUtc: '2025-06-03T13:30:00.000Z',
      });
      const secondSlot = MockAppointmentAvailabilityResponse.createSlot({
        dtStartUtc: secondSlotStart,
        dtEndUtc: '2025-06-03T14:00:00.000Z',
      });
      mockAppointmentAvailabilityApi({
        response: new MockAppointmentAvailabilityResponse({
          availableSlots: [firstSlot, secondSlot],
        }).toJSON(),
      });

      mockAppointmentDetailsApi({
        response: new MockAppointmentDetailsResponse({
          appointmentId: 'abcdef123456',
          startUTC: secondSlotStart,
          endUTC: '2025-06-03T14:00:00.000Z',
        }).toJSON(),
      });

      // Format expected date/time in the same timezone as the app (works in UTC or any server TZ)
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const expectedDate = formatInTimeZone(
        firstSlotStart,
        tz,
        'EEEE, MMMM dd, yyyy',
      );
      const expectedTime1 = formatInTimeZone(firstSlotStart, tz, 'hh:mm a');
      const expectedTime2 = formatInTimeZone(secondSlotStart, tz, 'hh:mm a');

      // Control time so calendar and slots are consistent
      cy.clock(mockToday, ['Date']);

      VerifyPageObject.assertVerifyPage();
      cy.injectAxeThenAxeCheck();
      VerifyPageObject.fillAndSubmitValidForm();

      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.assertEnterOTPPage();
      cy.injectAxeThenAxeCheck();
      EnterOTPPageObject.fillAndSubmitValidOTP();

      cy.wait('@vass:get:appointment-availability');
      DateTimeSelectionPageObject.assertDateTimeSelectionPage();
      cy.injectAxeThenAxeCheck();
      // Select first slot (index 0) in a consistent manner
      DateTimeSelectionPageObject.selectFirstAvailableDate();
      DateTimeSelectionPageObject.selectTimeSlotByIndex(0);
      DateTimeSelectionPageObject.clickContinue();

      cy.wait('@vass:get:topics');
      cy.injectAxeThenAxeCheck();
      TopicSelectionPageObject.assertTopicSelectionPage();
      TopicSelectionPageObject.selectTopicAndContinue(topic);

      ReviewPageObject.assertReviewPage();
      cy.injectAxeThenAxeCheck();
      ReviewPageObject.assertTopicDescription(topic);
      ReviewPageObject.assertDateTimeDescriptionContains(expectedDate);
      ReviewPageObject.assertDateTimeDescriptionContains(expectedTime1);

      // Change date/time: go back and select the second slot
      ReviewPageObject.clickEditDateTime();
      DateTimeSelectionPageObject.assertDateTimeSelectionPage();
      DateTimeSelectionPageObject.selectFirstAvailableDate();
      DateTimeSelectionPageObject.selectTimeSlotByIndex(1);
      DateTimeSelectionPageObject.clickContinue();

      TopicSelectionPageObject.assertTopicSelectionPage();
      TopicSelectionPageObject.clickContinue();

      ReviewPageObject.assertReviewPage();
      ReviewPageObject.assertDateTimeDescriptionContains(expectedDate);
      ReviewPageObject.assertDateTimeDescriptionContains(expectedTime2);
      ReviewPageObject.clickConfirmAppointment();

      cy.wait('@vass:post:appointment');
      cy.injectAxeThenAxeCheck();
      cy.wait('@vass:get:appointment-details');

      ConfirmationPageObject.assertConfirmationPage({
        agentName: 'Agent Smith',
        topics: [topic],
      });
      ConfirmationPageObject.assertWhenSectionContainsDateTime(expectedDate);
      ConfirmationPageObject.assertWhenSectionContainsDateTime(expectedTime2);
      cy.injectAxeThenAxeCheck();
    });

    it('should allow the user to change the topic', () => {
      const firstTopic = 'General VA benefits';
      const secondTopic = 'Education';

      VerifyPageObject.assertVerifyPage();
      cy.injectAxeThenAxeCheck();
      VerifyPageObject.fillAndSubmitValidForm();

      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.assertEnterOTPPage();
      cy.injectAxeThenAxeCheck();
      EnterOTPPageObject.fillAndSubmitValidOTP();

      cy.wait('@vass:get:appointment-availability');
      DateTimeSelectionPageObject.assertDateTimeSelectionPage();
      cy.injectAxeThenAxeCheck();
      DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();

      cy.wait('@vass:get:topics');
      cy.injectAxeThenAxeCheck();
      TopicSelectionPageObject.assertTopicSelectionPage();
      TopicSelectionPageObject.selectTopicAndContinue(firstTopic);

      ReviewPageObject.assertReviewPage();
      cy.injectAxeThenAxeCheck();
      ReviewPageObject.assertTopicDescription(firstTopic);

      // Change topic: go back, unselect first and select second
      ReviewPageObject.clickEditTopic();
      TopicSelectionPageObject.assertTopicSelectionPage();
      TopicSelectionPageObject.unselectTopicByTestId(
        'topic-checkbox-general-va-benefits',
      );
      TopicSelectionPageObject.selectTopicAndContinue(secondTopic);

      ReviewPageObject.assertReviewPage();
      ReviewPageObject.assertTopicDescription(secondTopic);
      ReviewPageObject.clickConfirmAppointment();

      cy.wait('@vass:post:appointment');
      cy.injectAxeThenAxeCheck();
      cy.wait('@vass:get:appointment-details');

      ConfirmationPageObject.assertConfirmationPage({
        agentName: 'Agent Smith',
        topics: [secondTopic],
      });
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Cancel Appointment', () => {
    beforeEach(() => {
      const appointmentId = 'abcdef123456';
      const availabilityResponse = new MockAppointmentAvailabilityResponse({
        appointmentId,
        availableSlots: MockAppointmentAvailabilityResponse.createSlots(),
      }).toJSON();
      mockAppointmentAvailabilityApi({
        response: availabilityResponse,
        responseCode: 200,
      });

      mockTopicsApi();

      mockCreateAppointmentApi();

      mockAppointmentDetailsApi({
        response: new MockAppointmentDetailsResponse({
          appointmentId,
        }).toJSON(),
        responseCode: 200,
      });
      mockCancelAppointmentApi();
    });

    it('should cancel an appointment from the schdelued appointment confirmation page', () => {
      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);

      VerifyPageObject.assertVerifyPage();
      cy.injectAxeThenAxeCheck();

      VerifyPageObject.fillAndSubmitForm({
        lastName: 'Smith',
        dateOfBirth: '1935-04-07',
      });

      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.assertEnterOTPPage();

      cy.injectAxeThenAxeCheck();
      EnterOTPPageObject.fillAndSubmitValidOTP();

      cy.wait('@vass:get:appointment-availability');
      DateTimeSelectionPageObject.assertDateTimeSelectionPage();
      cy.injectAxeThenAxeCheck();
      DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();

      cy.wait('@vass:get:topics');
      cy.injectAxeThenAxeCheck();
      TopicSelectionPageObject.assertTopicSelectionPage();
      TopicSelectionPageObject.selectTopicAndContinue('General VA benefits');

      ReviewPageObject.assertReviewPage();
      cy.injectAxeThenAxeCheck();
      ReviewPageObject.clickConfirmAppointment();

      cy.wait('@vass:post:appointment');
      cy.injectAxeThenAxeCheck();
      cy.wait('@vass:get:appointment-details');

      cy.injectAxeThenAxeCheck();
      ConfirmationPageObject.clickCancelAppointment();

      CancelAppointmentPageObject.assertCancelAppointmentPage({
        agentName: 'Agent Smith',
      });
      cy.injectAxeThenAxeCheck();

      CancelAppointmentPageObject.clickYesCancelAppointment();
      cy.wait('@vass:post:cancel-appointment');

      CancelConfirmationPageObject.assertCancelConfirmationPage({
        agentName: 'Agent Smith',
      });
      cy.injectAxeThenAxeCheck();
    });

    it('should cancel an appointment from a cancelation link', () => {
      cy.visit(
        `/service-member/benefits/solid-start/schedule?uuid=${uuid}&cancel=true`,
      );

      VerifyPageObject.assertVerifyPage({ cancellationFlow: true });
      cy.injectAxeThenAxeCheck();
      VerifyPageObject.fillAndSubmitValidForm();

      cy.wait('@vass:post:request-otp');
      cy.injectAxeThenAxeCheck();
      EnterOTPPageObject.assertEnterOTPPage({ cancellationFlow: true });
      EnterOTPPageObject.assertSuccessAlertContainsEmail('s****@email.com');
      EnterOTPPageObject.fillAndSubmitValidOTP();

      cy.wait('@vass:get:appointment-details');

      cy.injectAxeThenAxeCheck();
      CancelAppointmentPageObject.assertCancelAppointmentPage({
        agentName: 'Agent Smith',
      });

      CancelAppointmentPageObject.clickYesCancelAppointment();
      cy.wait('@vass:post:cancel-appointment');

      CancelConfirmationPageObject.assertCancelConfirmationPage({
        agentName: 'Agent Smith',
      });
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Already Scheduled Appointment', () => {
    beforeEach(() => {
      const appointmentId = 'already-scheduled-appointment-id';
      const startUTC = '2025-12-20T14:00:00Z';
      const endUTC = '2025-12-20T14:30:00Z';
      mockAppointmentAvailabilityApi({
        response: createAppointmentAlreadyBookedError({
          appointmentId,
          dtStartUTC: startUTC,
          dtEndUTC: endUTC,
        }),
        responseCode: 409,
      });

      mockTopicsApi();

      mockAppointmentDetailsApi({
        response: new MockAppointmentDetailsResponse({
          appointmentId,
          startUTC,
          endUTC,
        }).toJSON(),
        responseCode: 200,
      });
      mockCancelAppointmentApi({
        response: new MockCancelAppointmentResponse({
          appointmentId,
        }).toJSON(),
        responseCode: 200,
      });
    });

    describe('when the user attempts to schedule an appointment that is already scheduled', () => {
      it('should redirect to the already scheduled appointment page', () => {
        cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);

        VerifyPageObject.assertVerifyPage();
        cy.injectAxeThenAxeCheck();
        VerifyPageObject.fillAndSubmitValidForm();

        cy.wait('@vass:post:request-otp');
        cy.injectAxeThenAxeCheck();
        EnterOTPPageObject.fillAndSubmitValidOTP();

        cy.wait('@vass:get:appointment-availability');
        cy.wait('@vass:get:appointment-details');

        AlreadyScheduledPageObject.assertAlreadyScheduledPage();
        cy.injectAxeThenAxeCheck();
      });

      it('should allow the user to cancel', () => {
        cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);

        VerifyPageObject.assertVerifyPage();
        cy.injectAxeThenAxeCheck();
        VerifyPageObject.fillAndSubmitValidForm();

        cy.wait('@vass:post:request-otp');
        EnterOTPPageObject.assertEnterOTPPage();
        cy.injectAxeThenAxeCheck();
        EnterOTPPageObject.fillAndSubmitValidOTP();

        cy.wait('@vass:get:appointment-availability');
        cy.wait('@vass:get:appointment-details');

        AlreadyScheduledPageObject.assertAlreadyScheduledPage();
        cy.injectAxeThenAxeCheck();
        AlreadyScheduledPageObject.clickCancelAppointment();

        CancelAppointmentPageObject.assertCancelAppointmentPage({
          agentName: 'Agent Smith',
        });
        cy.injectAxeThenAxeCheck();

        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');

        CancelConfirmationPageObject.assertCancelConfirmationPage({
          agentName: 'Agent Smith',
        });
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
