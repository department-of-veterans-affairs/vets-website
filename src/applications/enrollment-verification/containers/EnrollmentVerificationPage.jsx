import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchVerificationStatus } from '../actions';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationAlert from '../components/EnrollmentVerificationAlert';
import EnrollmentVerificationMonths from '../components/EnrollmentVerificationMonths';

export const EnrollmentVerificationPage = ({
  getVerificationStatus,
  loggedIn,
  verificationStatus,
}) => {
  useEffect(
    () => {
      // TODO Uncomment once ID.me issues are resolved.
      // if (!loggedIn) {
      //   window.location.href = '/enrollment-history/';
      // }

      if (!verificationStatus) {
        getVerificationStatus();
      }
    },
    [getVerificationStatus, loggedIn, verificationStatus],
  );

  if (!verificationStatus) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Enrollment Verification</h1>
      <p className="va-introtext">
        If you get a monthly housing allowance (MHA) or kicker payments (or
        both) under the Post-9/11 GI Bill, you’ll need to verify your enrollment
        each month. If you don’t verify your enrollment for two months in a row,
        we will pause your monthly education payments.
      </p>

      <EnrollmentVerificationAlert status={verificationStatus} />

      <EnrollmentVerificationMonths status={verificationStatus} />

      <div className="ev-highlighted-content-container">
        <header className="ev-highlighted-content-container_header">
          <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
            Related pages
          </h1>
        </header>
        <div className="ev-highlighted-content-container_content">
          <nav className="ev-related-pages-nav">
            <ul>
              <li>
                <a href="#">See your GI Bill Statement of Benefits</a>
              </li>
              <li>
                <a href="#">See your past benefit payments</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </EnrollmentVerificationPageWrapper>
  );
};

const mapStateToProps = state => ({
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  verificationStatus: state?.data?.verificationStatus,
});

const mapDispatchToProps = {
  getVerificationStatus: fetchVerificationStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationPage);
