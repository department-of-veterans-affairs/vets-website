import React from 'react';
import PropTypes from 'prop-types';

export default function DeniedUI({ user, dateReceived }) {
  return (
    <>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h3 slot="headline">You’re not eligible for this benefit</h3>
          <div>
            <p>
              Unfortunately, based on the information you provided and
              Department of Defense records, we have determined you are not
              eligible for the Transfer of Entitlement for Post-9/11 GI Bill®
              (Chapter 33) benefit at this time.
            </p>{' '}
            <p>
              Your decision letter, which explains why you are ineligible, is
              now available. A physical copy will also be mailed to your mailing
              address.
            </p>
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
          <li>
            Download a copy of your decision letter. This can also be found in
            your VA education inbox.
          </li>
          <li>
            You will be notified if you are eligible for other VA education
            benefits.
          </li>
          <li>There is no further action required by you at this time.</li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--3">
        <a className="vads-c-action-link--green " href="/?next=%2Fprofile">
          Go to your My VA dashboard
        </a>
      </div>
    </>
  );
}

DeniedUI.propTypes = {
  dateReceived: PropTypes.string,
  user: PropTypes.object,
};
