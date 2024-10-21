import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationBreadcrumbs from './EnrollmentVerificationBreadcrumbs';

export default function EnrollmentVerificationPageWrapper({ children }) {
  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            {children}
          </div>
        </div>

        <va-back-to-top />
      </div>
    </>
  );
}

EnrollmentVerificationPageWrapper.propTypes = {
  children: PropTypes.any,
};
