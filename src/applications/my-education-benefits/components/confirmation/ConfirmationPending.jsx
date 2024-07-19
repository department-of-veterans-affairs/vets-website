import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../LoadingIndicator';
import FormFooter from '../FormFooter';

const ConfirmationPending = ({
  claimantName,
  confirmationDate,
  confirmationError,
  confirmationLoading,
  printPage,
  sendConfirmation,
  userEmail,
  userFirstName,
}) => {
  useEffect(
    () => {
      sendConfirmation({
        claimStatus: 'IN_PROGRESS',
        email: userEmail,
        firstName: userFirstName,
      });
    },
    [sendConfirmation, userEmail, userFirstName],
  );

  if (confirmationLoading) {
    return <LoadingIndicator message="Sending confirmation email..." />;
  }

  if (confirmationError) {
    return (
      <div>Error sending confirmation email: {confirmationError.message}</div>
    );
  }

  return (
    <div className="meb-confirmation-page meb-confirmation-page_pending">
      <va-alert status="success">
        <h3 slot="headline">We’ve received your application</h3>
        <p>
          Your application requires additional review. Once we have reviewed
          your application, we will reach out to notify you about next steps.
        </p>
      </va-alert>

      <div className="feature">
        <h3>Application for VA education benefits (Form 22-1990)</h3>
        {claimantName.trim() ? <p>For {claimantName}</p> : <></>}
        <dl>
          <dt>Date received</dt>
          <dd>{confirmationDate}</dd>
        </dl>
        <va-button
          className="usa-button meb-print"
          onClick={printPage}
          type="button"
        >
          Print this page
        </va-button>
      </div>

      <h2>When will I hear back about my application?</h2>
      <div className="feature meb-feature--secondary">
        <h2>In 1 month</h2>
        <hr className="meb-hr" />
        <p>
          If more than a month has passed since you gave us your application and
          you haven’t heard back, please don’t apply again. Call our toll-free
          Education Call Center at <va-telephone contact="8884424551" /> or{' '}
          <va-telephone contact="9187815678" international /> if you are outside
          the U.S.
        </p>
      </div>

      <h2>What happens next?</h2>
      <ul>
        <li>We will review your eligibility for the Post-9/11 GI Bill.</li>
        <li>We may reach out with questions about your application.</li>
        <li>
          You will be notified if you are eligible for VA education benefits.
        </li>
        <li>There is no further action required by you at this time.</li>
      </ul>

      <h2>What can I do while I wait?</h2>
      <ul>
        <li>
          If you need to submit documentation to VA, such as service records,
          please send this through <a href="/contact-us">Ask VA</a>.
        </li>
        <li>
          Review and/or update your direct deposit information on{' '}
          <a href="/change-direct-deposit/">your VA.gov profile</a>.
        </li>
        <li>
          Use our{' '}
          <a href="/education/gi-bill-comparison-tool/">
            GI Bill Comparison Tool
          </a>{' '}
          to help you decide which education program and school is best for you.
        </li>
        <li>
          Learn more about VA benefits and programs through the{' '}
          <a href="https://blogs.va.gov/VAntage/78073/new-guide-series-provides-gi-bill-benefits-information/">
            Building Your Future with the GI Bill Series
          </a>
          .
        </li>
        <li>
          Measure your interests and skill levels and help figure out your
          career path with{' '}
          <a href="https://www.benefits.va.gov/gibill/careerscope.asp">
            CareerScope®
          </a>
          .
        </li>
      </ul>

      <a className="vads-c-action-link--green" href="/my-va/">
        Go to your My VA dashboard
      </a>

      <FormFooter />
    </div>
  );
};

ConfirmationPending.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool.isRequired,
  confirmationLoading: PropTypes.bool.isRequired,
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
};

export default ConfirmationPending;
