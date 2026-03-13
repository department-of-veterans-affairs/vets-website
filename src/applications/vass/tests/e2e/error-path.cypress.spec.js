import VerifyPageObject from './page-objects/VerifyPageObject';
import EnterOTPPageObject from './page-objects/EnterOTPPageObject';
import DateTimeSelectionPageObject from './page-objects/DateTimeSelectionPageObject';
import TopicSelectionPageObject from './page-objects/TopicSelectionPageObject';
import ReviewPageObject from './page-objects/ReviewPageObject';
import CancelAppointmentPageObject from './page-objects/CancelAppointmentPageObject';
import ConfirmationPageObject from './page-objects/ConfirmationPageObject';
import AlreadyScheduledPageObject from './page-objects/AlreadyScheduledPageObject';
import {
  mockRequestOtpApi,
  mockAuthenticateOtpApi,
  mockAppointmentAvailabilityApi,
  mockTopicsApi,
  mockCreateAppointmentApi,
  mockAppointmentDetailsApi,
  mockCancelAppointmentApi,
  patchCookiesForCI,
  saveScreenshot,
} from './vass-e2e-helpers';
import MockRequestOtpResponse from '../fixtures/MockRequestOtpResponse';
import MockAuthenticateOtpResponse from '../fixtures/MockAuthenticateOtpResponse';
import MockAppointmentAvailabilityResponse from '../fixtures/MockAppointmentAvailabilityResponse';
import MockTopicsResponse from '../fixtures/MockTopicsResponse';
import MockCreateAppointmentResponse from '../fixtures/MockCreateAppointmentResponse';
import MockAppointmentDetailsResponse from '../fixtures/MockAppointmentDetailsResponse';
import MockCancelAppointmentResponse from '../fixtures/MockCancelAppointmentResponse';
import { createMockJwt } from '../../utils/mock-helpers';
import { FLOW_TYPES } from '../../utils/constants';

const uuid = 'c0ffee-1234-beef-5678';
const expiresIn = 3600;

describe('VASS Error Paths', () => {
  beforeEach(() => {
    // Patch document.cookie so the VASS JWT cookie can be stored
    // in CI where the test server runs on http://127.0.0.1 (not HTTPS/va.gov)
    patchCookiesForCI();
  });

  describe('Verify Identity', () => {
    describe('API Errors', () => {
      describe('when the user submits invalid credentials', () => {
        beforeEach(() => {
          mockRequestOtpApi({
            response: MockRequestOtpResponse.createInvalidCredentialsError(),
            responseCode: 401,
          });
          cy.visit(
            `/service-member/benefits/solid-start/schedule?uuid=${uuid}`,
          );
        });

        it('should display an error when identity verification fails for the first time', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.enterLastName('WrongName');
          VerifyPageObject.enterDateOfBirth('1990-01-01');
          VerifyPageObject.clickSubmit();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertInvalidCredentialsErrorAlert();
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_invalidCredentials');
        });

        it('should display a verification error alert after 3 failed attempts', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.fillAndSubmitForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.clickSubmit();
          cy.wait('@vass:post:request-otp');

          VerifyPageObject.clickSubmit();
          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertInvalidVerificationErrorAlert({
            exist: true,
          });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_3FailedAttempts');
        });
      });

      describe('when the user is rate limited', () => {
        beforeEach(() => {
          mockRequestOtpApi({
            response: MockRequestOtpResponse.createRateLimitExceededError(),
            responseCode: 429,
          });
          cy.visit(
            `/service-member/benefits/solid-start/schedule?uuid=${uuid}`,
          );
        });

        it('should display a verification error alert', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.fillAndSubmitForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertInvalidVerificationErrorAlert({
            exist: true,
          });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_rateLimited');
        });
      });

      describe('when the API returns a server error', () => {
        beforeEach(() => {
          mockRequestOtpApi({
            response: MockRequestOtpResponse.createVassApiError(),
            responseCode: 500,
          });
          cy.visit(
            `/service-member/benefits/solid-start/schedule?uuid=${uuid}`,
          );
        });

        it('should display a wrapper error alert', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.fillAndSubmitForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_serverError500');
        });
      });

      describe('when the service is unavailable', () => {
        beforeEach(() => {
          mockRequestOtpApi({
            response: MockRequestOtpResponse.createServiceError(),
            responseCode: 503,
          });
          cy.visit(
            `/service-member/benefits/solid-start/schedule?uuid=${uuid}`,
          );
        });

        it('should display a wrapper error alert', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.fillAndSubmitForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_serviceUnavailable503');
        });
      });
    });

    describe('UI Errors', () => {
      beforeEach(() => {
        cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      });
      describe('when the user leaves the last name input empty', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.enterLastName('');
          VerifyPageObject.enterDateOfBirth('1990-01-01');
          VerifyPageObject.clickSubmit();

          VerifyPageObject.assertLastNameError('Please enter your last name');
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_emptyLastName');
        });
      });

      describe('when the user leaves the date of birth input empty', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          VerifyPageObject.assertVerifyPage();

          VerifyPageObject.enterLastName('Smith');
          VerifyPageObject.clickSubmit();

          VerifyPageObject.assertDateOfBirthError(
            'Please enter your date of birth',
          );
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_verify_emptyDateOfBirth');
        });
      });
    });
  });

  describe('OTP Verification Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();
      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      VerifyPageObject.fillAndSubmitForm();
      cy.wait('@vass:post:request-otp');
    });

    describe('API Errors', () => {
      describe('when the user enters an invalid OTP', () => {
        beforeEach(() => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createInvalidOtpError(3),
            responseCode: 401,
          });
        });

        it('should display an invalid OTP error', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertOTPErrorAlert({
            exist: true,
            containsText:
              'The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again.',
          });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_invalidCode');
        });

        it('should display an invalid OTP error when the user has 1 remaining attempt', () => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createInvalidOtpError(1),
            responseCode: 401,
          });

          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertOTPErrorAlert({
            exist: true,
            containsText:
              'The one-time verification code you entered doesn’t match the one we sent you. You have 1 try left. Then you’ll need to wait 15 minutes before trying again.',
          });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_lastAttempt');
        });
      });

      describe('when the user account is locked', () => {
        beforeEach(() => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createAccountLockedError(),
            responseCode: 401,
          });
        });

        it('should display a verification error alert', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertVerificationErrorPage();
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_accountLocked');
        });
      });

      describe('when the OTP has expired', () => {
        beforeEach(() => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createOtpExpiredError(),
            responseCode: 401,
          });
        });

        it('should display an OTP error alert', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertOTPErrorAlert({
            exist: true,
            containsText:
              'The one-time verification code you entered has expired. Select the link in your email to get a new code and schedule a call.',
          });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_expired');
        });
      });

      describe('when the API returns a server error', () => {
        beforeEach(() => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createVassApiError(),
            responseCode: 500,
          });
        });

        it('should display a wrapper error alert', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_serverError500');
        });
      });

      describe('when the service is unavailable', () => {
        beforeEach(() => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createServiceError(),
            responseCode: 503,
          });
        });

        it('should display a wrapper error alert', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_serviceUnavailable503');
        });
      });
    });

    describe('UI Errors', () => {
      describe('when the user leaves the OTP input empty', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.submitEmptyForm();

          EnterOTPPageObject.assertOTPError(
            'Please enter your one-time verification code',
          );
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_otp_emptyInput');
        });
      });

      describe('when the user enters an invalid OTP', () => {
        describe('when the user enters a non-numeric OTP', () => {
          it('should not submit the form and display an error when the user submits the form', () => {
            EnterOTPPageObject.assertEnterOTPPage();

            EnterOTPPageObject.enterOTP('aaaaaa');
            EnterOTPPageObject.clickContinue();

            EnterOTPPageObject.assertOTPError(
              'Your verification code should only contain numbers',
            );
            cy.injectAxeThenAxeCheck();
            saveScreenshot('vass_error_otp_nonNumericInput');
          });
        });

        describe('when the user enters a less than 6 digits OTP', () => {
          it('should not submit the form and display an error when the user submits the form', () => {
            EnterOTPPageObject.assertEnterOTPPage();

            EnterOTPPageObject.enterOTP('12345');
            EnterOTPPageObject.clickContinue();

            EnterOTPPageObject.assertOTPError(
              'Your verification code should be 6 digits',
            );
            cy.injectAxeThenAxeCheck();
            saveScreenshot('vass_error_otp_tooShort');
          });
        });
      });
    });
  });

  describe('Appointment Availability Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();
      const authenticateOtpResponse = new MockAuthenticateOtpResponse({
        token: createMockJwt(uuid, expiresIn),
        expiresIn,
      }).toJSON();
      mockAuthenticateOtpApi({
        response: authenticateOtpResponse,
        responseCode: 200,
      });

      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      VerifyPageObject.fillAndSubmitForm();
      cy.wait('@vass:post:request-otp');
    });

    describe('API Errors', () => {
      describe('when the user is not within the cohort window', () => {
        beforeEach(() => {
          mockAppointmentAvailabilityApi({
            response: MockAppointmentAvailabilityResponse.createNotWithinCohortError(),
            responseCode: 403,
          });
        });

        it('should display a wrapper error alert', () => {
          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_availability_notWithinCohort');
        });
      });

      describe('when the user already has an appointment booked', () => {
        beforeEach(() => {
          const appointmentId = 'e61e1a40-1e63-f011-bec2-001dd80351ea';
          mockAppointmentAvailabilityApi({
            response: MockAppointmentAvailabilityResponse.createAppointmentAlreadyBookedError(
              { appointmentId },
            ),
            responseCode: 409,
          });
          mockAppointmentDetailsApi({
            response: new MockAppointmentDetailsResponse({
              appointmentId,
            }).toJSON(),
            responseCode: 200,
          });
        });

        it('should redirect to the already scheduled page', () => {
          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:get:appointment-availability');
          cy.wait('@vass:get:appointment-details');

          AlreadyScheduledPageObject.assertAlreadyScheduledPage();
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_availability_alreadyBooked');
        });
      });

      describe('when no slots are available', () => {
        beforeEach(() => {
          mockAppointmentAvailabilityApi({
            response: MockAppointmentAvailabilityResponse.createNoSlotsAvailableError(),
            responseCode: 404,
          });
        });

        it('should display a wrapper error alert', () => {
          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_availability_noSlots');
        });
      });

      describe('when the API returns a server error', () => {
        beforeEach(() => {
          mockAppointmentAvailabilityApi({
            response: MockAppointmentAvailabilityResponse.createVassApiError(),
            responseCode: 500,
          });
        });

        it('should display a wrapper error alert', () => {
          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_availability_serverError500');
        });
      });

      describe('when the service is unavailable', () => {
        beforeEach(() => {
          mockAppointmentAvailabilityApi({
            response: MockAppointmentAvailabilityResponse.createServiceError(),
            responseCode: 503,
          });
        });

        it('should display a wrapper error alert', () => {
          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_availability_serviceUnavailable503');
        });
      });
    });

    describe('UI Errors', () => {
      const appointmentId = 'appointment-id';
      beforeEach(() => {
        mockAppointmentAvailabilityApi({
          response: new MockAppointmentAvailabilityResponse({
            appointmentId,
            availableSlots: MockAppointmentAvailabilityResponse.createSlots(),
          }).toJSON(),
          responseCode: 200,
        });
      });
      describe('when does not select a date and time slot', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:post:authenticate-otp');
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertDateTimeSelectionPage();
          DateTimeSelectionPageObject.submitWithoutSelection();

          DateTimeSelectionPageObject.assertValidationError(
            'Please select a preferred date and time for your appointment.',
          );
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_dateTime_emptyInput');
        });
      });

      describe('when the user submits the form without selecting a time slot after selecting a date', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:post:authenticate-otp');
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertDateTimeSelectionPage();
          DateTimeSelectionPageObject.selectFirstAvailableDate();
          DateTimeSelectionPageObject.clickContinue();

          DateTimeSelectionPageObject.assertValidationError(
            'Please select a preferred date and time for your appointment.',
          );
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_dateTime_missingTimeSelection');
        });
      });

      describe('when the user selects a valid date and time after triggering a validation error', () => {
        it('should clear the validation error and proceed to topic selection', () => {
          mockTopicsApi();

          EnterOTPPageObject.assertEnterOTPPage();

          EnterOTPPageObject.fillAndSubmitOTP();
          cy.wait('@vass:post:authenticate-otp');
          cy.wait('@vass:get:appointment-availability');

          DateTimeSelectionPageObject.assertDateTimeSelectionPage();
          DateTimeSelectionPageObject.submitWithoutSelection();
          DateTimeSelectionPageObject.assertValidationError(
            'Please select a preferred date and time for your appointment.',
          );

          DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
          cy.wait('@vass:get:topics');

          TopicSelectionPageObject.assertTopicSelectionPage();
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_dateTime_validationClearsAfterSelection');
        });
      });
    });
  });

  describe('Topics Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();

      const authenticateOtpResponse = new MockAuthenticateOtpResponse({
        token: createMockJwt(uuid, expiresIn),
        expiresIn,
      }).toJSON();
      mockAuthenticateOtpApi({
        response: authenticateOtpResponse,
        responseCode: 200,
      });

      mockAppointmentAvailabilityApi();

      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      VerifyPageObject.fillAndSubmitForm();
      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.fillAndSubmitOTP();
    });

    describe('API Errors', () => {
      describe('when the API returns a server error', () => {
        beforeEach(() => {
          mockTopicsApi({
            response: MockTopicsResponse.createVassApiError(),
            responseCode: 500,
          });
        });

        it('should display a wrapper error alert', () => {
          DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
          cy.wait('@vass:get:topics');

          TopicSelectionPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_topics_serverError500');
        });
      });

      describe('when the service is unavailable', () => {
        beforeEach(() => {
          mockTopicsApi({
            response: MockTopicsResponse.createServiceError(),
            responseCode: 503,
          });
        });

        it('should display a wrapper error alert', () => {
          DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
          cy.wait('@vass:get:topics');

          TopicSelectionPageObject.assertWrapperErrorAlert({ exist: true });
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_topics_serviceUnavailable503');
        });
      });
    });

    describe('UI Errors', () => {
      describe('when the user leaves all topic selections empty', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          mockTopicsApi();

          DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
          cy.wait('@vass:get:topics');

          TopicSelectionPageObject.assertTopicSelectionPage();
          TopicSelectionPageObject.submitWithoutSelection();

          TopicSelectionPageObject.assertValidationError(
            'Please choose a topic for your appointment.',
          );
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_topics_emptySelection');
        });
      });

      describe('when the user unselects all topics after making a selection', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          mockTopicsApi();

          DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
          cy.wait('@vass:get:topics');

          TopicSelectionPageObject.assertTopicSelectionPage();
          TopicSelectionPageObject.selectTopicByName('General VA benefits');
          TopicSelectionPageObject.unselectTopicByTestId(
            'topic-checkbox-general-va-benefits',
          );
          TopicSelectionPageObject.clickContinue();

          TopicSelectionPageObject.assertValidationError(
            'Please choose a topic for your appointment.',
          );
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_topics_unselectedAfterSelection');
        });
      });

      describe('when the user selects a valid topic after triggering a validation error', () => {
        it('should clear the validation error and proceed to review', () => {
          mockTopicsApi();

          DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
          cy.wait('@vass:get:topics');

          TopicSelectionPageObject.assertTopicSelectionPage();
          TopicSelectionPageObject.submitWithoutSelection();
          TopicSelectionPageObject.assertValidationError(
            'Please choose a topic for your appointment.',
          );

          TopicSelectionPageObject.selectTopicAndContinue(
            'General VA benefits',
          );

          ReviewPageObject.assertReviewPage();
          cy.injectAxeThenAxeCheck();
          saveScreenshot('vass_error_topics_validationClearsAfterSelection');
        });
      });
    });
  });

  describe('Create Appointment Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();

      const authenticateOtpResponse = new MockAuthenticateOtpResponse({
        token: createMockJwt(uuid, expiresIn),
        expiresIn,
      }).toJSON();
      mockAuthenticateOtpApi({
        response: authenticateOtpResponse,
        responseCode: 200,
      });

      mockAppointmentAvailabilityApi();
      mockTopicsApi();

      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      VerifyPageObject.fillAndSubmitForm();
      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.fillAndSubmitOTP();
      DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
      TopicSelectionPageObject.selectTopicAndContinue('General VA benefits');
    });

    describe('when the appointment fails to save', () => {
      beforeEach(() => {
        mockCreateAppointmentApi({
          response: MockCreateAppointmentResponse.createAppointmentSaveFailedError(),
          responseCode: 500,
        });
      });

      it('should display a wrapper error alert', () => {
        ReviewPageObject.clickConfirmAppointment();
        cy.wait('@vass:post:appointment');

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_create_saveFailed');
      });
    });

    describe('when the API returns a server error', () => {
      beforeEach(() => {
        mockCreateAppointmentApi({
          response: MockCreateAppointmentResponse.createVassApiError(),
          responseCode: 500,
        });
      });

      it('should display a wrapper error alert', () => {
        ReviewPageObject.clickConfirmAppointment();
        cy.wait('@vass:post:appointment');

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_create_serverError500');
      });
    });

    describe('when the service is unavailable', () => {
      beforeEach(() => {
        mockCreateAppointmentApi({
          response: MockCreateAppointmentResponse.createServiceError(),
          responseCode: 503,
        });
      });

      it('should display a wrapper error alert', () => {
        ReviewPageObject.clickConfirmAppointment();
        cy.wait('@vass:post:appointment');

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_create_serviceUnavailable503');
      });
    });
  });

  describe('Appointment Details Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();

      const authenticateOtpResponse = new MockAuthenticateOtpResponse({
        token: createMockJwt(uuid, expiresIn),
        expiresIn,
      }).toJSON();
      mockAuthenticateOtpApi({
        response: authenticateOtpResponse,
        responseCode: 200,
      });

      mockAppointmentAvailabilityApi();
      mockTopicsApi();
      mockCreateAppointmentApi();

      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      VerifyPageObject.fillAndSubmitForm();
      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.fillAndSubmitOTP();
      DateTimeSelectionPageObject.selectFirstAvailableDateTimeAndContinue();
      TopicSelectionPageObject.selectTopicAndContinue('General VA benefits');
    });

    describe('when the appointment is not found', () => {
      beforeEach(() => {
        mockAppointmentDetailsApi({
          response: MockAppointmentDetailsResponse.createAppointmentNotFoundError(),
          responseCode: 404,
        });
      });

      it('should display a wrapper error alert', () => {
        ReviewPageObject.clickConfirmAppointment();
        cy.wait('@vass:post:appointment');

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_details_notFound');
      });
    });

    describe('when the API returns a server error', () => {
      beforeEach(() => {
        mockAppointmentDetailsApi({
          response: MockAppointmentDetailsResponse.createVassApiError(),
          responseCode: 500,
        });
      });

      it('should display a wrapper error alert', () => {
        ReviewPageObject.clickConfirmAppointment();
        cy.wait('@vass:post:appointment');

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_details_serverError500');
      });
    });

    describe('when the service is unavailable', () => {
      beforeEach(() => {
        mockAppointmentDetailsApi({
          response: MockAppointmentDetailsResponse.createServiceError(),
          responseCode: 503,
        });
      });

      it('should display a wrapper error alert', () => {
        ReviewPageObject.clickConfirmAppointment();
        cy.wait('@vass:post:appointment');

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_details_serviceUnavailable503');
      });
    });
  });

  describe('Cancel Appointment Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();

      const authenticateOtpResponse = new MockAuthenticateOtpResponse({
        token: createMockJwt(uuid, expiresIn),
        expiresIn,
      }).toJSON();
      mockAuthenticateOtpApi({
        response: authenticateOtpResponse,
        responseCode: 200,
      });

      const appointmentId = 'abcdef123456';
      mockAppointmentAvailabilityApi({
        response: new MockAppointmentAvailabilityResponse({
          appointmentId,
          availableSlots: MockAppointmentAvailabilityResponse.createSlots(),
        }).toJSON(),
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

      cy.visit(
        `/service-member/benefits/solid-start/schedule?uuid=${uuid}&cancel=true`,
      );
      VerifyPageObject.fillAndSubmitForm();
      cy.wait('@vass:post:request-otp');
    });

    describe('when cancellation fails', () => {
      beforeEach(() => {
        mockCancelAppointmentApi({
          response: MockCancelAppointmentResponse.createCancellationFailedError(),
          responseCode: 500,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_cancel_failed');
      });
    });

    describe('when the appointment to cancel is not found', () => {
      beforeEach(() => {
        mockAppointmentDetailsApi({
          response: MockAppointmentDetailsResponse.createAppointmentNotFoundError(),
          responseCode: 404,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        cy.wait('@vass:get:appointment-details');

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_cancel_appointmentNotFound');
      });
    });

    describe('when the cancellation returns appointment not found', () => {
      beforeEach(() => {
        mockCancelAppointmentApi({
          response: MockCancelAppointmentResponse.createAppointmentNotFoundError(),
          responseCode: 404,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_cancel_cancellationNotFound');
      });
    });

    describe('when the API returns a server error', () => {
      beforeEach(() => {
        mockCancelAppointmentApi({
          response: MockCancelAppointmentResponse.createVassApiError(),
          responseCode: 500,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_cancel_serverError500');
      });
    });

    describe('when the service is unavailable', () => {
      beforeEach(() => {
        mockCancelAppointmentApi({
          response: MockCancelAppointmentResponse.createServiceError(),
          responseCode: 503,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_cancel_serviceUnavailable503');
      });
    });
  });

  describe('Navigation', () => {
    describe('when the user attempt to navigate back from the Date/Time Selection page', () => {
      beforeEach(() => {
        mockAppointmentAvailabilityApi();
        mockRequestOtpApi();
        const authenticateOtpResponse = new MockAuthenticateOtpResponse({
          token: createMockJwt(uuid, expiresIn),
          expiresIn,
        }).toJSON();
        mockAuthenticateOtpApi({
          response: authenticateOtpResponse,
          responseCode: 200,
        });

        cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
        VerifyPageObject.fillAndSubmitForm();
        cy.wait('@vass:post:request-otp');
      });

      it('should trigger a confirmation dialog', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        cy.wait('@vass:get:appointment-availability');
        DateTimeSelectionPageObject.assertDateTimeSelectionPage();
        cy.on('window:confirm', text => {
          expect(text).to.contains(
            'This page is asking you to confirm that you want to leave — information you’ve entered may not be saved',
          );
          return true; // accept
        });
        cy.injectAxeThenAxeCheck();
        cy.go('back');
      });
    });

    describe('when the user navigates to the solid start page without a uuid', () => {
      beforeEach(() => {
        cy.visit('/service-member/benefits/solid-start/schedule');
      });

      it('should show the wrapper error alert', () => {
        VerifyPageObject.assertWrapperErrorAlert({ exist: true });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_navigation_noUuid');
      });
    });

    describe('when the user decides not to cancel the appointment', () => {
      const appointmentId = 'abcdef123456';
      beforeEach(() => {
        mockRequestOtpApi();
        const authenticateOtpResponse = new MockAuthenticateOtpResponse({
          token: createMockJwt(uuid, expiresIn),
          expiresIn,
        }).toJSON();
        mockAuthenticateOtpApi({
          response: authenticateOtpResponse,
          responseCode: 200,
        });
        mockAppointmentAvailabilityApi({
          response: new MockAppointmentAvailabilityResponse({
            appointmentId,
            availableSlots: MockAppointmentAvailabilityResponse.createSlots(),
          }).toJSON(),
          responseCode: 200,
        });
        mockAppointmentDetailsApi({
          response: new MockAppointmentDetailsResponse({
            appointmentId,
          }).toJSON(),
          responseCode: 200,
        });

        cy.visit(
          `/service-member/benefits/solid-start/schedule?uuid=${uuid}&cancel=true`,
        );
        VerifyPageObject.fillAndSubmitForm();
        cy.wait('@vass:post:request-otp');
      });

      it('should navigate to the appointment details page', () => {
        EnterOTPPageObject.fillAndSubmitOTP();
        cy.wait('@vass:post:authenticate-otp');
        cy.wait('@vass:get:appointment-availability');
        cy.wait('@vass:get:appointment-details');

        CancelAppointmentPageObject.assertCancelAppointmentPage();
        cy.injectAxeThenAxeCheck();

        CancelAppointmentPageObject.clickNoDontCancel();

        ConfirmationPageObject.assertDetailsOnlyPage({
          agentName: 'Agent Smith',
        });
        cy.injectAxeThenAxeCheck();
        saveScreenshot('vass_error_navigation_noCancelAppointment');
      });
    });
  });
});
