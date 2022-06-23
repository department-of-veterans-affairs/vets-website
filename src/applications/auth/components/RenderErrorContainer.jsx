import React from 'react';
import PropTypes from 'prop-types';
import { AUTH_ERROR, AUTH_LEVEL } from 'platform/user/authentication/constants';
import Helpdesk from './HelpdeskContact';

export default function RenderErrorContainer({
  code = AUTH_ERROR.DEFAULT,
  auth = AUTH_LEVEL.FAIL,
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
    case AUTH_ERROR.USER_DENIED:
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
    case AUTH_ERROR.USER_CLOCK_MISMATCH:
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
    case AUTH_ERROR.SERVER_CLOCK_MISMATCH:
    case AUTH_ERROR.MVI_MISMATCH:
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
    case AUTH_ERROR.SESSION_EXPIRED:
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
    case AUTH_ERROR.LOGINGOV_PROOFING_FAIL:
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
    case AUTH_ERROR.MULTIPLE_MHVIDS:
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
    case AUTH_ERROR.MULTIPLE_EDIPIS:
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
    case AUTH_ERROR.ICN_MISMATCH:
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
    case AUTH_ERROR.UUID_MISSING:
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
    case AUTH_ERROR.MULTIPLE_CORPIDS:
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

    case AUTH_ERROR.OAUTH_STATE_MISMATCH:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble signing you in to VA.gov right now because the
          browser state is different.
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
      <p>
        <em>Error code: {code}</em>
      </p>
    </div>
  );
}

RenderErrorContainer.propTypes = {
  auth: PropTypes.oneOf(Object.keys(AUTH_LEVEL)),
  code: PropTypes.oneOf(Object.keys(AUTH_ERROR)),
  openLoginModal: PropTypes.func,
  recordEvent: PropTypes.func,
};
