import React from 'react';
import PropTypes from 'prop-types';
import { AUTH_ERRORS, AUTH_LEVEL } from 'platform/user/authentication/errors';
import Helpdesk from './HelpdeskContact';

export default function RenderErrorContainer({
  code = AUTH_ERRORS.DEFAULT.errorCode,
  auth = AUTH_LEVEL.FAIL,
  requestId = '',
  recordEvent = () => ({}),
  openLoginModal = () => ({}),
}) {
  let alertContent;
  let troubleshootingContent;

  if (auth === AUTH_LEVEL.FAIL) {
    recordEvent({
      event: code ? `login-error-code-${code}` : `login-error-no-code`,
    });
  }

  switch (code) {
    // User denied Authorization (ID Proofing)
    case AUTH_ERRORS.USER_DENIED.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. We couldn’t complete the identity verification process.
          It looks like you selected <strong>“Deny”</strong> when we asked for
          your permission to share your information with VA.gov. We can’t give
          you access to all the tools on VA.gov without sharing your information
          with the site.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p>
            Please try again, and this time, select <strong>“Accept”</strong> on
            the final page of the identity verification process. Or, if you
            don’t want to verify your identity with Login.gov or ID.me, you can
            try signing in with your premium DS Logon or premium My HealtheVet
            username and password.
          </p>
          <button type="button" onClick={openLoginModal}>
            Try signing in again
          </button>
        </>
      );
      break;

    // User's system time mismatch
    case AUTH_ERRORS.USER_CLOCK_MISMATCH.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. It looks like your computer’s clock isn’t showing the
          correct time, and that’s causing a problem in how it communicates with
          our system.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p>
            Please update your computer’s settings to the current date and time,
            and then try again.
          </p>
        </>
      );
      break;

    // Server time mismatch
    case AUTH_ERRORS.SERVER_CLOCK_MISMATCH.errorCode:
    case AUTH_ERRORS.MVI_MISMATCH.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. Something went wrong on our end, and we couldn’t sign you
          in. Please try signing in again in a few minutes.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <Helpdesk />
          <button type="button" onClick={openLoginModal}>
            Try signing in again
          </button>
        </>
      );
      break;

    // Session expired
    case AUTH_ERRORS.SESSION_EXPIRED.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We take your privacy very seriously. You didn’t take any action on
          VA.gov for 30 minutes, so we signed you out of the site to protect
          your personal information.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p>Please sign in again.</p>
          <button type="button" onClick={openLoginModal}>
            Sign in
          </button>
        </>
      );
      break;

    // Failure to Proof (Login.gov)
    case AUTH_ERRORS.LOGINGOV_PROOFING_FAIL.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. You were unable to create an account at Login.gov or
          failed to sign you into your account.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p />
          <p>
            For problems with your Login.gov account, please review{' '}
            <a
              href="https://www.login.gov/help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Login.gov's Help Section
            </a>{' '}
            or contact them at{' '}
            <a
              href="https://www.login.gov/contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Login.gov/contact.
            </a>
          </p>
          <Helpdesk>
            If you’ve taken the steps above and still can’t sign in,
          </Helpdesk>
          <button type="button" onClick={openLoginModal}>
            Try signing in again
          </button>
        </>
      );
      break;

    // Multiple MHV IDs (IENs) error
    case AUTH_ERRORS.MULTIPLE_MHVIDS.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in to VA.gov right now because we
          found more than one My HealtheVet account for you.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>How can I fix this issue?</h2>
          <ul>
            <li>
              <strong>Call the My HealtheVet help desk</strong>
              <Helpdesk />
              <p>
                Tell the representative that you tried to sign in to VA.gov, but
                got an error message that you have more than one My HealtheVet
                account.
              </p>
            </li>
            <li>
              <strong>Submit a request for online help</strong>
              <p>
                Fill out a{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My HealtheVet online help form
                </a>{' '}
                to get help signing in. Enter the following information in the
                form fields.
              </p>
              <p>
                <strong>Fill in the form fields as below:</strong>
              </p>
              <ul>
                <li>Topic: Select "Account Login"</li>
                <li>Category: Select "Request for Assistance"</li>
                <li>
                  Comments: Type, or copy and paste, the below message:
                  <br />
                  “When I tried to sign in to VA.gov, I got an error message
                  saying that I have more than one My HealtheVet account.”
                </li>
              </ul>
              <p>Complete the rest of the form and then click Submit.</p>
            </li>
          </ul>
        </>
      );
      break;

    // Multiple EDIPIs
    case AUTH_ERRORS.MULTIPLE_EDIPIS.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in to VA.gov right now because we
          found more than one DoD ID number for you.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <Helpdesk />
        </>
      );
      break;

    // ICN Mismatch
    case AUTH_ERRORS.ICN_MISMATCH.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in right now because your My
          HealtheVet account number doesn’t match the account number on your
          VA.gov account.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>To fix this issue:</h2>
          <Helpdesk />
        </>
      );
      break;

    // UUID Missing (Login.gov or ID.me)
    case AUTH_ERRORS.UUID_MISSING.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in right now because one of your
          account numbers is missing for your VA.gov account.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>To fix this issue:</h2>
          <Helpdesk />
        </>
      );
      break;

    // Multiple Corp IDs
    case AUTH_ERRORS.MULTIPLE_CORPIDS.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in to VA.gov right now because we
          found more than one account number for you.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>To fix this issue:</h2>
          <Helpdesk />
        </>
      );
      break;

    case AUTH_ERRORS.MHV_VERIFICATION_ERROR.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in with your My Healthevet account
          right now because the services you are requesting require you to have
          a Premium <strong>My Healthevet</strong> account.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>How can I fix this issue?</h2>
          <p className="va-introtext">
            Read below to learn how to upgrade to a Premium{' '}
            <strong>My HealtheVet</strong> account online or in person if you’re
            a VA patient.
          </p>
          <div>
            <h3>Sign up for a Premium account online</h3>
            <p>
              Follow these 2 steps to get a Premium{' '}
              <strong>My HealtheVet</strong> account online.
            </p>
            <ol
              className="vads-u-padding--0 vads-u-margin--0"
              style={{ listStylePosition: 'inside' }}
            >
              <li>
                <strong>
                  Sign up for an account on the My HealtheVet website.
                </strong>{' '}
                You'll need to have your Social Security number on hand. Be sure
                to choose <strong>VA Patient</strong> on the registration form.
                <br />
                <a href="https://www.myhealth.va.gov/mhv-portal-web/user-registration/">
                  Sign up for a My HealtheVet account
                </a>
                <br />
                <p>
                  <strong>Note:</strong> If you have a{' '}
                  <strong>Login.gov</strong>, <strong>ID.me</strong>, or Premium{' '}
                  <strong>DS Logon</strong> account, you can skip step 1 above
                  and go right to step 2 to sign in to{' '}
                  <strong>My HealtheVet</strong> with either of these accounts.
                </p>
              </li>
              <li>
                <strong>Upgrade to a Premium account.</strong> To do this, sign
                in to <strong>My HealtheVet</strong> using your{' '}
                <strong>Login.gov</strong>, <strong>ID.me</strong>, or Premium{' '}
                <strong>DS Logon</strong> account credentials.
                <br />
                <p>
                  Once signed in, select the <strong>Upgrade Now</strong> button
                  at the top left side of the screen. Then, on the account
                  upgrade page, check the box certifying that you're the owner
                  of the account and approve the request, and click{' '}
                  <strong>Continue</strong>
                </p>
                <p>
                  The system will upgrade you to a Premium account.
                  <a
                    className="vads-u-display--inline-block"
                    href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/user-login?redirect=/mhv-portal-web/user-registration/user-login"
                  >
                    Sign in to My HealtheVet
                  </a>
                </p>
              </li>
            </ol>
          </div>
          <div>
            <h3>Sign up for a Premium account in person</h3>
            <p>
              You can get a Premium <strong>My HealtheVet</strong> account in
              person at a VA health facility if you’re a VA patient. You’ll need
              to bring this form and ID with you:
            </p>
            <ul>
              <li>
                <strong>
                  A completed and signed Individuals’ Request for a Copy of
                  Their Own Health Information (VA Form 10-5345a).
                </strong>{' '}
                This “VA release of information” form gives us permission to
                share an electronic copy of your health record with your online
                account. You can download a PDF copy of the form now, call ahead
                to ask the staff to mail you a form, or ask for a form when you
                get there.
                <a
                  className="vads-u-display--inline-block"
                  href="/find-forms/about-form-10-5345a"
                >
                  Get VA Form 10-5345a to download
                </a>
                <a
                  className="vads-u-display--inline-block"
                  href="/find-locations/"
                >
                  Find the phone number for your nearest VA health care facility
                </a>
              </li>
              <li>
                <strong>A government-issued photo ID.</strong> This can be
                either your Veteran Health Identification Card or a valid
                driver’s license.
              </li>
            </ul>
            <p>
              A VA staff member will verify your identity. Then they’ll record
              your information in the <strong>My HealtheVet</strong> system and
              confirm you’re eligible for a Premium account. A copy of your VA
              Form 10-5345a-MHV will be added to your VA medical record, and the
              original paper copy will be shredded to protect your privacy.
            </p>
            <p>
              <strong>Note:</strong> When you open or download a PDF file, you
              create a temporary file on your computer. Other people may be able
              to see this file—and any personal health information you fill
              in—especially if you’re using a public or shared computer.
            </p>
          </div>
          <Helpdesk>
            If you’ve taken the steps above and still can’t sign in,
          </Helpdesk>
        </>
      );
      break;

    case AUTH_ERRORS.CERNER_PROVISIONING_FAILURE.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble provisioning your My VA Health account right now.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>How can I fix this issue?</h2>
          <Helpdesk startScentence />
        </>
      );
      break;

    case AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in to VA.gov right now because of a
          network error.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p>Please sign in again.</p>
          <button type="button" onClick={openLoginModal}>
            Sign in
          </button>
        </>
      );
      break;

    case AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in to VA.gov because there was an
          error in the URL.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p>
            <strong>Try taking these steps to fix the problem:</strong>
          </p>
          <ul>
            <li>
              Clear your Internet browser’s cookies and cache. Depending on
              which browser you’re using, you’ll usually find this information
              referred to as “Browsing Data,”, “Browsing History,” or “Website
              Data.”
            </li>
            <li>
              Make sure you have cookies enabled in your browser settings.
              Depending on which browser you’re using, you’ll usually find this
              information in the “Tools,” “Settings,” or “Preferences” menu.
            </li>
          </ul>
          <Helpdesk>
            If you’ve taken the steps above and still can’t sign in,
          </Helpdesk>
        </>
      );
      break;

    // Catch all generic error
    default:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. Something went wrong on our end, and we couldn’t sign you
          in.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <p>
            <strong>Try taking these steps to fix the problem:</strong>
          </p>
          <ul>
            <li>
              Clear your Internet browser’s cookies and cache. Depending on
              which browser you’re using, you’ll usually find this information
              referred to as “Browsing Data,”, “Browsing History,” or “Website
              Data.”
            </li>
            <li>
              Make sure you have cookies enabled in your browser settings.
              Depending on which browser you’re using, you’ll usually find this
              information in the “Tools,” “Settings,” or “Preferences” menu.
            </li>
            <li>
              <p>
                If you’re using Internet Explorer or Microsoft Edge, and
                clearing your cookies and cache doesn’t fix the problem, try
                using Google Chrome or Mozilla Firefox as your browser instead.
              </p>
              <p>
                <a
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Google Chrome
                </a>
              </p>
              <p>
                <a
                  href="https://www.mozilla.org/en-US/firefox/new/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Mozilla Firefox
                </a>
              </p>
            </li>
            <li>
              If you’re using Chrome or Firefox and it’s not working, make sure
              you’ve updated your browser with the latest updates.
            </li>
          </ul>
          <Helpdesk>
            If you’ve taken the steps above and still can’t sign in,
          </Helpdesk>
        </>
      );
  }

  return (
    <div className="usa-content columns small-12">
      <h1>We can’t sign you in</h1>
      <va-alert visible status="error">
        {alertContent}
      </va-alert>
      {troubleshootingContent}
      <p className="vads-u-font-style--italic">
        <span className="vads-u-display--block" data-testid="error-code">
          Error code: {code}
        </span>
        <span data-testid="request-id" className="vads-u-display--block">
          Request ID: {requestId}
        </span>
        <span className="vads-u-display--block" data-testid="timestamp">
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'long',
          }).format(new Date())}
        </span>
      </p>
    </div>
  );
}

RenderErrorContainer.propTypes = {
  auth: PropTypes.oneOf(Object.values(AUTH_LEVEL)),
  code: PropTypes.oneOf(
    Object.values(AUTH_ERRORS).map(({ errorCode }) => errorCode),
  ),
  openLoginModal: PropTypes.func,
  recordEvent: PropTypes.func,
  requestId: PropTypes.string,
};
