import React from 'react';
import PropTypes from 'prop-types';

export default function UnderReviewConfirmation({ user, dateReceived }) {
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
      <div className="vads-u-margin-bottom--6">
        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <div>
            <h3
              slot="headline"
              className="vads-u-margin-top--2 vads-u-margin-bottom--4"
            >
              Application for VA education benefits (Form 22-1990e)
            </h3>
            For {user}
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <strong>Date received</strong>
              {dateReceived}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="usa-button vads-u-margin-top--3 vads-u-width--auto"
            >
              Print this page
            </button>
          </div>
        </va-alert>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>When will I hear back about my application?</h2>
        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          status="continue"
          visible
        >
          <div>
            <h2 className="vads-u-margin-y--0">In 1 month</h2>
            <hr className="meb-hr" />
            If more than a month has passed since you gave us your application
            and you haven’t heard back, please don’t apply again. Contact us
            through{' '}
            <a
              href="https://ask.va.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask VA
            </a>
            .
          </div>
        </va-alert>
      </div>
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
            If you need to submit documentation to VA, such as service records,
            please send this through our{' '}
            <a
              href="https://ask.va.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask VA feature
            </a>
            .
          </li>
          <li>
            <a
              href="/profile/direct-deposit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Review and/or update your direct deposit information on your
              VA.gov profile
            </a>
            .
          </li>
          <li>
            <a
              href="/education/gi-bill-comparison-tool/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use our GI Bill Comparison Tool to help you decide which schools
              are best for you
            </a>
            .
          </li>
          <li>
            <a
              href="https://benefits.va.gov/GIBILL/docs/GIBguideseries/ChooseYourEducationPathway.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about VA benefits and programs through the Building
              Your Future with the GI Bill Series
            </a>
            .
          </li>
        </ul>
      </div>
    </>
  );
}

UnderReviewConfirmation.propTypes = {
  dateReceived: PropTypes.string,
  user: PropTypes.shape({
    fullName: PropTypes.string,
    confirmationNumber: PropTypes.string,
  }),
};
