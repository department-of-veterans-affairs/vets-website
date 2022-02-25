import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { fetchVerificationStatus } from '../actions';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationAlert from '../components/EnrollmentVerificationAlert';
import EnrollmentVerificationMonths from '../components/EnrollmentVerificationMonths';
import { ENROLLMENT_VERIFICATION_TYPE } from '../helpers';

export const EnrollmentVerificationPage = ({
  getVerificationStatus,
  hasCheckedKeepAlive,
  loggedIn,
  verificationStatus,
}) => {
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !loggedIn) {
        history.push('/');
      }

      if (!verificationStatus) {
        getVerificationStatus();
      }
    },
    [
      getVerificationStatus,
      hasCheckedKeepAlive,
      history,
      loggedIn,
      verificationStatus,
    ],
  );

  if (!verificationStatus) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Post-9/11 GI Bill enrollment verifications</h1>
      <p className="va-introtext">
        If you get a monthly housing allowance (MHA) or kicker payments (or
        both) under the Post-9/11 GI Bill
        <sup>&reg;</sup> (Chapter 33), you’ll need to verify your enrollment
        each month. If you don’t verify your enrollment for{' '}
        <strong>three months in a row</strong>, we will pause your monthly
        education payments.
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
                <a href="/">See your GI Bill Statement of Benefits</a>
              </li>
              <li>
                <a href="/">See your past benefit payments</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </EnrollmentVerificationPageWrapper>
  );
};

const mapStateToProps = state => ({
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
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

EnrollmentVerificationPage.propTypes = {
  getVerificationStatus: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  loggedIn: PropTypes.bool,
  verificationStatus: ENROLLMENT_VERIFICATION_TYPE,
};
