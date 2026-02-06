import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const UnderReviewConfirmation = ({ user, printPage, dateReceived }) => {
  useEffect(() => {
    // Logic for sending confirmation email or any other setup if needed
  }, []);

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
          Application for VA Education Benefits (VA Form 22-5490)
        </h3>
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          DEA, Chapter 35
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

        <div className="vads-u-margin-bottom--1">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Confirmation for your records
          </h4>
          <p className="vads-u-margin--0">
            You can print this confirmation page for your records.
          </p>
        </div>

        <div className="vads-u-margin-bottom--1">
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
            We’ll review your eligibility for the Survivors' and Dependents'
            Educational Assistance (Chapter 35).
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
        </ul>
      </div>
    </>
  );
};

UnderReviewConfirmation.propTypes = {
  printPage: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  dateReceived: PropTypes.string,
};

UnderReviewConfirmation.defaultProps = {
  dateReceived: null,
};

export default UnderReviewConfirmation;
