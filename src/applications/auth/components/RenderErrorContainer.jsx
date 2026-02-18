import React from 'react';
import { AUTH_ERRORS, AUTH_LEVEL } from 'platform/user/authentication/errors';
import ContactCenterInformation from 'platform/user/authentication/components/ContactCenterInformation';
import StatusPage from 'platform/user/authentication/components/StatusPage';

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
      event: `login-error-code-${code}`,
    });
  }

  switch (code) {
    // 001 - User denied Authorization (ID Proofing)
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
            the final page of the identity verification process.
          </p>
          <va-button onClick={openLoginModal} text="Try signing in again" />
        </>
      );
      break;

    // 002 - User's system time mismatch
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
    case AUTH_ERRORS.SERVER_CLOCK_MISMATCH.errorCode: // 003 - Server timing mismatch
    case AUTH_ERRORS.MVI_MISMATCH.errorCode: // 004 - MVI mismatch
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. Something went wrong on our end, and we couldn’t sign you
          in. Please try signing in again in a few minutes.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>What you can do:</h2>
          <va-button onClick={openLoginModal} text="Try signing in again" />
          <ContactCenterInformation
            startSentence
            className="vads-u-display--block vads-u-margin-top--2"
          />
        </>
      );
      break;

    // 005 - Session expired
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
          <va-button onClick={openLoginModal} text="Sign in" />
        </>
      );
      break;

    // 009 - Failure to Proof (Login.gov)
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
          <va-button onClick={openLoginModal} text="Try signing in again" />
          <ContactCenterInformation className="vads-u-display--block vads-u-margin-top--2">
            If you’ve taken the steps above and still can’t sign in,
          </ContactCenterInformation>
        </>
      );
      break;

    // 101 - Multiple MHV IDs (IENs) error
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
              <ContactCenterInformation />
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

    // 102 - Multiple EDIPIs
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
          <ContactCenterInformation startSentence />
        </>
      );
      break;

    // 103 - ICN Mismatch
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
          <ContactCenterInformation startSentence />
        </>
      );
      break;

    // 104 - UUID Missing (Login.gov or ID.me)
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
          <ContactCenterInformation startSentence />
        </>
      );
      break;

    // 106 - Multiple Corp IDs
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
          <ContactCenterInformation startSentence />
        </>
      );
      break;

    // 112 - MHV Provisioning Failure (ToU-specific)
    case AUTH_ERRORS.MHV_PROVISIONING_FAILURE.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble provisioning your My HealtheVet account right now
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>How can I fix this issue?</h2>
          <p>Try signing in again in a few minutes.</p>
          <ContactCenterInformation startSentence />
        </>
      );
      break;

    // 110 - Cerner/Oracle Health provisioning failure (ToU-specific)
    case AUTH_ERRORS.CERNER_PROVISIONING_FAILURE.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re having trouble provisioning your My VA Health account right now.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>How can I fix this issue?</h2>
          <ContactCenterInformation startSentence />
        </>
      );
      break;

    // 111 - Ineligible for Cerner (ToU-specific)
    case AUTH_ERRORS.CERNER_NOT_ELIGIBLE.errorCode:
      alertContent = (
        <p className="vads-u-margin-top--0">
          We’re sorry. Your health care services are not managed with My VA
          Health. However, you can still use VA.gov and My HealtheVet to access
          your health care and benefits.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>How can I fix this issue?</h2>
          <p>
            Navigate to the My HealtheVet page to manage your VA health care and
            benefits. You can do this by using the "Access My HealtheVet" link
            below
          </p>
          <a href="/my-health">Access My HealtheVet</a>
          <ContactCenterInformation className="vads-u-display--block">
            If you’re still running into issues,
          </ContactCenterInformation>
        </>
      );
      break;

    // 113 - Personal Information Mismatch
    case AUTH_ERRORS.SSN_ATTRIBUTE_MISMATCH.errorCode:
      alertContent = (
        <p>
          There’s a temporary issue in our system. We’re working to fix it as
          soon as possible.
        </p>
      );
      troubleshootingContent = (
        <>
          <h2>Access you VA benefits in other ways</h2>
          <p>
            Until we fix this issue, you can manage your VA benefits over the
            phone, by mail, or in person. We understand this isn’t as
            convenient, and appreciate your patience.
          </p>
          <va-link
            href="/resources/helpful-va-phone-numbers/"
            text="Get a list of helpful VA phone numbers"
            className="vads-u-display--block vads-u-margin-top--2"
          />
          <br />
          <va-link
            href="/find-locations"
            text="Find a VA location near you"
            className="vads-u-display--block vads-u-margin-top--2"
          />
        </>
      );
      break;

    // 202 - OAuth State mismatch (SiS-specific)
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
          <va-button onClick={openLoginModal} text="Sign in" />
        </>
      );
      break;

    // 203 - OAuth invalid request (SiS-specific)
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
          <ContactCenterInformation>
            If you’ve taken the steps above and still can’t sign in,
          </ContactCenterInformation>
        </>
      );
      break;

    // 108 - MHV Verification account issue (MHV credential no longer authorized as of March 5, 2025
    // 007 - Catch all generic error
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
          <ContactCenterInformation>
            If you’ve taken the steps above and still can’t sign in,
          </ContactCenterInformation>
        </>
      );
  }

  return (
    <div className="usa-content columns small-12">
      <h1>
        {code === AUTH_ERRORS.SSN_ATTRIBUTE_MISMATCH.errorCode
          ? 'We can’t sign you in right now'
          : 'We can’t sign you in'}
      </h1>
      <va-alert visible status="error" uswds>
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
      {code === AUTH_ERRORS.SSN_ATTRIBUTE_MISMATCH.errorCode && <StatusPage />}
    </div>
  );
}
