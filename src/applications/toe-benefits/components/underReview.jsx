import React from 'react';
import PropTypes from 'prop-types';

export default function UnderReview({ user, dateReceived }) {
  const { fullName, confirmationNumber } = user;
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
            For {fullName}
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-y--4">
              <strong>Confirmation number</strong>
              {confirmationNumber}
            </div>
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
            <h3
              slot="headline"
              className="vads-u-margin-top--2 vads-u-margin-bottom--4"
            >
              Alert headline
            </h3>
            This is an alert
          </div>
        </va-alert>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>Download a copy of your decision letter.</li>
          <li>
            Use our <a href="/demo">GI Bill Comparison Tool</a> to help you
            decide which education program and school is best for you.
          </li>
          <li>
            Once you’ve selected a school or program, you may bring your
            decision letter to your School Certifying Official to provide proof
            of eligibility.
          </li>
          <li>
            Review and/or update your direct deposit information on your VA.gov
            profile.
          </li>
          <li>
            Learn more about VA benefits and programs through the Building Your
            Future with the GI Bill Series.
          </li>
          <li>
            If you have more than one sponsor, you can{' '}
            <a href="/">submit another application for education benefits.</a>
          </li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--3">
        <va-additional-info trigger="What is a decision letter?">
          <div>
            A decision letter is an official document from the U.S. Department
            of Veterans Affairs that details your GI Bill benefit status. If you
            are approved to receive benefits, you may provide this official
            document to your educational institution to prove your eligibility
            status.
          </div>
        </va-additional-info>
      </div>
    </>
  );
}

UnderReview.prototype = {
  dateReceived: PropTypes.string,
  user: PropTypes.object,
};
