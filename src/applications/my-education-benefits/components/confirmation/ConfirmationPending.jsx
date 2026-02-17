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
  useEffect(() => {
    sendConfirmation({
      claimStatus: 'IN_PROGRESS',
      email: userEmail,
      firstName: userFirstName,
    });
  }, [sendConfirmation, userEmail, userFirstName]);

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
      <va-summary-box class="vads-u-margin-y--3">
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Application for VA education benefits (Form 22-1990)
        </h3>
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Post-9/11 GI Bill, Chapter 33
        </h3>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Who submitted this form
          </h4>
          {claimantName.trim() ? (
            <p className="vads-u-margin--0">{claimantName}</p>
          ) : (
            <p className="vads-u-margin--0">Not provided</p>
          )}
        </div>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Date received
          </h4>
          <p className="vads-u-margin--0">{confirmationDate}</p>
        </div>

        <div className="vads-u-margin-bottom--3">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Confirmation for your records
          </h4>
          <p className="vads-u-margin--0">
            You can print this confirmation page for your records.
          </p>
        </div>

        <div className="vads-u-margin-bottom--2">
          <va-button
            className="usa-button meb-print"
            text="Print this page"
            onClick={printPage}
          />
        </div>
      </va-summary-box>
      <h2>When will I hear back about my application?</h2>
      <va-card background class="vads-u-margin-y--3">
        <h2>In 1 month</h2>
        <hr className="meb-hr" />
        <p>
          If more than a month has passed since you gave us your application and
          you haven’t heard back, please don’t apply again. Call our Education
          Call Center toll-free at <va-telephone contact="8884424551" /> or{' '}
          <va-telephone contact="9187815678" international /> if you are outside
          the U.S.
        </p>
      </va-card>
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
          <va-link
            href="https://ask.va.gov/"
            external
            text="If you need to submit documentation to VA, such as service records, please send this through Ask VA"
          />
          .
        </li>
        <li>
          <va-link
            href="/change-direct-deposit/"
            text="Review and/or update your direct deposit information on your VA.gov profile"
          />
          .
        </li>
        <li>
          <va-link
            href="/education/gi-bill-comparison-tool/"
            text="Use our GI Bill Comparison Tool on VA.gov to help you decide which education program and school is best for you"
          />
          .
        </li>
        <li>
          <va-link
            href="https://benefits.va.gov/gibill/docs/gibguideseries/chooseyoureducationbenefits.pdf"
            external
            filetype="PDF"
            text="Learn more about VA benefits and programs through the Building Your Future with the GI Bill Series"
          />
          .
        </li>
        <li>
          <va-link
            href="https://www.benefits.va.gov/gibill/careerscope.asp"
            external
            text="Measure your interests and skill levels and help figure out your career path with CareerScope® on VA.gov"
          />
          .
        </li>
      </ul>
      <va-link
        class="vads-c-action-link--green"
        href="/my-va/"
        text="Go to your My VA dashboard"
      />
      .<FormFooter />
    </div>
  );
};

ConfirmationPending.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool,
  confirmationLoading: PropTypes.bool,
};

ConfirmationPending.defaultProps = {
  confirmationError: null,
  confirmationLoading: false,
};

export default ConfirmationPending;
