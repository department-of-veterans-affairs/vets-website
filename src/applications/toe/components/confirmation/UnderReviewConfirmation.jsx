import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../LoadingIndicator';
import FormFooter from '../FormFooter';

const UnderReviewConfirmation = ({
  user,
  dateReceived,
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
    <>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h3 slot="headline">We’ve received your application</h3>
          <div>
            Your application requires additional review. Once we have reviewed
            your application, we will reach out to notify you about next steps.
          </div>
        </va-alert>
      </div>
      <va-summary-box class="vads-u-margin-y--3">
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Application for VA education benefits (Form 22-1990e)
        </h3>
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Transfer of Entitlement
        </h3>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Who submitted this form
          </h4>
          <p className="vads-u-margin--0">{user || 'Not provided'}</p>
        </div>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Date received
          </h4>
          <p className="vads-u-margin--0">{dateReceived}</p>
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
            uswds
            className="usa-button vads-u-margin-top--3 vads-u-width--auto"
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
          you haven’t heard back, please don’t apply again.{' '}
          <va-link
            href="https://ask.va.gov"
            external
            text="Contact us through Ask VA"
          />
          .
        </p>
      </va-card>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>
            We’ll review your eligibility for the Transfer of Entitlement
            Post-9/11 GI Bill.
          </li>
          <li>We may reach out with questions about your application.</li>
          <li>
            We’ll notify you if you’re eligible for other VA education benefits.
          </li>
          <li>We don’t require further action from you at this time.</li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What can I do while I wait?</h2>
        <ul>
          <li>
            <va-link
              href="https://ask.va.gov/"
              external
              text="If you need to submit documentation to VA, such as service records, please send this through our Ask VA feature"
            />
            .
          </li>
          <li>
            <va-link
              href="/profile/direct-deposit"
              text="Review and/or update your direct deposit information on your VA.gov profile"
            />
            .
          </li>
          <li>
            <va-link
              href="/education/gi-bill-comparison-tool/"
              text="Use our GI Bill Comparison Tool on VA.gov to help you decide which schools are best for you"
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
        </ul>
      </div>
      <FormFooter />
    </>
  );
};

UnderReviewConfirmation.propTypes = {
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  confirmationError: PropTypes.object,
  confirmationLoading: PropTypes.bool,
  dateReceived: PropTypes.string,
  user: PropTypes.shape({
    fullName: PropTypes.string,
    confirmationNumber: PropTypes.string,
  }),
};

UnderReviewConfirmation.defaultProps = {
  confirmationError: null,
  confirmationLoading: false,
};

export default UnderReviewConfirmation;
