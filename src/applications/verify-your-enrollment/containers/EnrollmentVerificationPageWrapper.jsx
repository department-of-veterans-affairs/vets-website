import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import MGIBEnrollmentStatement from '../components/MGIBEnrollmentStatement';
import PeriodsToVerify from '../components/PeriodsToVerify';
import PreviousEnrollmentVerifications from '../components/PreviousEnrollmentVerifications';
import PageLink from '../components/PageLink';
import {
  BENEFITS_PROFILE_RELATIVE_URL,
  BENEFITS_PROFILE_URL,
} from '../constants';

const EnrollmentVerificationPageWrapper = ({ children }) => {
  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <MGIBEnrollmentStatement />
            <PeriodsToVerify />
            <PageLink
              linkText="Manage your benefits profile"
              relativeURL={BENEFITS_PROFILE_RELATIVE_URL}
              URL={BENEFITS_PROFILE_URL}
            />
            <PreviousEnrollmentVerifications />
            {children}
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};

EnrollmentVerificationPageWrapper.propTypes = {
  children: PropTypes.any,
};

export default EnrollmentVerificationPageWrapper;
