import React from 'react';
import PropTypes from 'prop-types';

export default function ApprovedUI({ user, dateReceived }) {
  return (
    <>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h3 slot="headline">
            Congratulations! You have been approved for the Transfer of
            Entitlement for Post-9/11 GI Bill®
          </h3>
          <div>
            We reviewed your application and have determined that you are
            entitled to educational benefits under the Transfer of Entitlement
            for Post-9/11 GI Bill® (Chapter 33). Your decision letter is now
            available. A physical copy will also be mailed to your mailing
            address.
          </div>
          <div>
            <a
              className="vads-u-font-weight--bold vads-u-flex--1 vads-u-margin-bottom--6"
              download
              href="/demo"
            >
              <i
                className="fa fa-download vads-u-display--inline-block vads-u-margin-right--1"
                aria-hidden="true"
              />
              Download your decision letter (PDF).
            </a>
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
            <h3 slot="headline" style={{ marginTop: '1rem' }}>
              Application for VA education benefits (Form 22-1990e)
            </h3>
            For {user.fullName}
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
      <div className="vads-u-margin-bottom--3">
        <a className="vads-c-action-link--green " href="/?next=%2Fprofile">
          Go to your My VA dashboard
        </a>
      </div>
    </>
  );
}

ApprovedUI.propTypes = {
  dateReceived: PropTypes.string,
  user: PropTypes.object,
};
