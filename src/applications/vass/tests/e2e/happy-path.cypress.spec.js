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
} from './vass-e2e-helpers';
import { createMockJwt } from '../../utils/mock-helpers';
import MockAuthenticateOtpResponse from '../fixtures/MockAuthenticateOtpResponse';
import ReviewPageObject from './page-objects/ReviewPageObject';
import ConfirmationPageObject from './page-objects/ConfirmationPageObject';
import CancelAppointmentPageObject from './page-objects/CancelAppointmentPageObject';
import CancelConfirmationPageObject from './page-objects/CancelConfirmationPageObject';
import AlreadyScheduledPageObject from './page-objects/AlreadyScheduledPageObject';
import { createAppointmentAlreadyBookedError } from '../../services/mocks/utils/errors';

const uuid = 'c0ffee-1234-beef-5678';
const expiresIn = 3600;

describe('VASS Schedule Appointment', () => {
  beforeEach(() => {
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

      mockAppointmentDetailsApi({
        appointmentId: 'abcdef123456',
      });
    });

    it('should schedule an appointment from a schedule link url', () => {
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
  });

  describe('Cancel Appointment', () => {
    beforeEach(() => {
      mockAppointmentAvailabilityApi();

      mockTopicsApi();

      mockCreateAppointmentApi();

      mockAppointmentDetailsApi({
        appointmentId: 'abcdef123456',
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
      mockAppointmentAvailabilityApi({
        response: createAppointmentAlreadyBookedError(),
        responseCode: 409,
      });

      mockTopicsApi();

      mockCreateAppointmentApi();

      mockAppointmentDetailsApi({
        appointmentId: 'e61e1a40-1e63-f011-bec2-001dd80351ea',
      });
      mockCancelAppointmentApi();
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
    });
  });
});
