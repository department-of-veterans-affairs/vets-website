import VerifyPageObject from './page-objects/VerifyPageObject';
import EnterOTPPageObject from './page-objects/EnterOTPPageObject';
import DateTimeSelectionPageObject from './page-objects/DateTimeSelectionPageObject';
import TopicSelectionPageObject from './page-objects/TopicSelectionPageObject';
import ReviewPageObject from './page-objects/ReviewPageObject';
import CancelAppointmentPageObject from './page-objects/CancelAppointmentPageObject';
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
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.enterLastName('WrongName');
          VerifyPageObject.enterDateOfBirth('1990-01-01');
          VerifyPageObject.clickSubmit();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertInvalidCredentialsErrorAlert();
        });

        it('should display a verification error alert after 3 failed attempts', () => {
          VerifyPageObject.assertVerifyPage();
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.fillAndSubmitDefaultForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.clickSubmit();
          cy.wait('@vass:post:request-otp');

          VerifyPageObject.clickSubmit();
          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertInvalidVerificationErrorAlert({
            exist: true,
          });
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
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.fillAndSubmitDefaultForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertInvalidVerificationErrorAlert({
            exist: true,
          });
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
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.fillAndSubmitDefaultForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertWrapperErrorAlert({ exist: true });
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
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.fillAndSubmitDefaultForm();

          cy.wait('@vass:post:request-otp');

          VerifyPageObject.assertWrapperErrorAlert({ exist: true });
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
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.enterLastName('');
          VerifyPageObject.enterDateOfBirth('1990-01-01');
          VerifyPageObject.clickSubmit();

          VerifyPageObject.assertLastNameError('Please enter your last name');
        });
      });

      describe('when the user leaves the date of birth input empty', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          VerifyPageObject.assertVerifyPage();
          cy.injectAxeThenAxeCheck();

          VerifyPageObject.enterLastName('Smith');
          VerifyPageObject.clickSubmit();

          VerifyPageObject.assertDateOfBirthError(
            'Please enter your date of birth',
          );
        });
      });
    });
  });

  describe('OTP Verification Errors', () => {
    beforeEach(() => {
      mockRequestOtpApi();
      cy.visit(`/service-member/benefits/solid-start/schedule?uuid=${uuid}`);
      VerifyPageObject.fillAndSubmitDefaultForm();
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
          cy.injectAxeThenAxeCheck();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertOTPErrorAlert({
            exist: true,
            containsText:
              'The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again.',
          });
        });

        it('should display an invalid OTP error when the user has 1 remaining attempt', () => {
          mockAuthenticateOtpApi({
            response: MockAuthenticateOtpResponse.createInvalidOtpError(1),
            responseCode: 401,
          });

          EnterOTPPageObject.assertEnterOTPPage();
          cy.injectAxeThenAxeCheck();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertOTPErrorAlert({
            exist: true,
            containsText:
              'The one-time verification code you entered doesn’t match the one we sent you. You have 1 try left. Then you’ll need to wait 15 minutes before trying again.',
          });
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
          cy.injectAxeThenAxeCheck();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertVerificationErrorPage();
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
          cy.injectAxeThenAxeCheck();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertWrapperErrorAlert({ exist: true });
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
          cy.injectAxeThenAxeCheck();

          EnterOTPPageObject.enterOTP('123456');
          EnterOTPPageObject.clickContinue();

          cy.wait('@vass:post:authenticate-otp');

          EnterOTPPageObject.assertWrapperErrorAlert({ exist: true });
        });
      });
    });

    describe('UI Errors', () => {
      describe('when the user leaves the OTP input empty', () => {
        it('should not submit the form and display an error when the user submits the form', () => {
          EnterOTPPageObject.assertEnterOTPPage();
          cy.injectAxeThenAxeCheck();

          EnterOTPPageObject.submitEmptyForm();

          EnterOTPPageObject.assertOTPError(
            'Please enter your one-time verification code',
          );
        });
      });

      describe('when the user enters an invalid OTP', () => {
        describe('when the user enters a non-numeric OTP', () => {
          it('should not submit the form and display an error when the user submits the form', () => {
            EnterOTPPageObject.assertEnterOTPPage();
            cy.injectAxeThenAxeCheck();

            EnterOTPPageObject.enterOTP('aaaaaa');
            EnterOTPPageObject.clickContinue();

            EnterOTPPageObject.assertOTPError(
              'Your verification code should only contain numbers',
            );
          });
        });

        describe('when the user enters a less than 6 digits OTP', () => {
          it('should not submit the form and display an error when the user submits the form', () => {
            EnterOTPPageObject.assertEnterOTPPage();
            cy.injectAxeThenAxeCheck();

            EnterOTPPageObject.enterOTP('12345');
            EnterOTPPageObject.clickContinue();

            EnterOTPPageObject.assertOTPError(
              'Your verification code should be 6 digits',
            );
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
      VerifyPageObject.fillAndSubmitDefaultForm();
      cy.wait('@vass:post:request-otp');
    });
    describe('when the user is not within the cohort window', () => {
      beforeEach(() => {
        mockAppointmentAvailabilityApi({
          response: MockAppointmentAvailabilityResponse.createNotWithinCohortError(),
          responseCode: 403,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitDefaultOTP();
        cy.wait('@vass:get:appointment-availability');
        cy.injectAxeThenAxeCheck();

        DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
      });
    });

    // TODO: implement this case
    // describe('when no slots are available', () => {
    //   beforeEach(() => {
    //     mockAppointmentAvailabilityApi({
    //       response: MockAppointmentAvailabilityResponse.createNoSlotsAvailableError(),
    //       responseCode: 404,
    //     });
    //   });

    //   it('should display a no slots available error', () => {
    //     // TODO: implement
    //   });
    // });

    describe('when the API returns a server error', () => {
      beforeEach(() => {
        mockAppointmentAvailabilityApi({
          response: MockAppointmentAvailabilityResponse.createVassApiError(),
          responseCode: 500,
        });
      });

      it('should display a wrapper error alert', () => {
        EnterOTPPageObject.fillAndSubmitDefaultOTP();
        cy.wait('@vass:get:appointment-availability');
        cy.injectAxeThenAxeCheck();

        DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
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
        EnterOTPPageObject.fillAndSubmitDefaultOTP();
        cy.wait('@vass:get:appointment-availability');
        cy.injectAxeThenAxeCheck();

        DateTimeSelectionPageObject.assertWrapperErrorAlert({ exist: true });
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
      VerifyPageObject.fillAndSubmitDefaultForm();
      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.fillAndSubmitDefaultOTP();
    });

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
        cy.injectAxeThenAxeCheck();

        TopicSelectionPageObject.assertWrapperErrorAlert({ exist: true });
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
        cy.injectAxeThenAxeCheck();

        TopicSelectionPageObject.assertWrapperErrorAlert({ exist: true });
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
      VerifyPageObject.fillAndSubmitDefaultForm();
      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.fillAndSubmitDefaultOTP();
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
        cy.injectAxeThenAxeCheck();

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
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
        cy.injectAxeThenAxeCheck();

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
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
        cy.injectAxeThenAxeCheck();

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
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
      VerifyPageObject.fillAndSubmitDefaultForm();
      cy.wait('@vass:post:request-otp');
      EnterOTPPageObject.fillAndSubmitDefaultOTP();
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
        cy.injectAxeThenAxeCheck();

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
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
        cy.injectAxeThenAxeCheck();

        ReviewPageObject.assertWrapperErrorAlert({ exist: true });
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
      VerifyPageObject.fillAndSubmitDefaultForm();
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
        EnterOTPPageObject.fillAndSubmitDefaultOTP();
        cy.wait('@vass:post:authenticate-otp');
        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');
        cy.injectAxeThenAxeCheck();

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
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
        EnterOTPPageObject.fillAndSubmitDefaultOTP();
        cy.wait('@vass:post:authenticate-otp');
        cy.wait('@vass:get:appointment-details');
        cy.injectAxeThenAxeCheck();

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
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
        EnterOTPPageObject.fillAndSubmitDefaultOTP();
        cy.wait('@vass:post:authenticate-otp');
        CancelAppointmentPageObject.clickYesCancelAppointment();
        cy.wait('@vass:post:cancel-appointment');
        cy.injectAxeThenAxeCheck();

        CancelAppointmentPageObject.assertWrapperErrorAlert({
          exist: true,
          flowType: FLOW_TYPES.CANCEL,
        });
      });
    });
  });
});
