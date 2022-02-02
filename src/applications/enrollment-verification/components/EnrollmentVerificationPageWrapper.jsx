import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

export default function EnrollmentVerificationPageWrapper({ children }) {
  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <Breadcrumbs>
              <a href="/">Home</a>
              <a href="#">Education and training</a>
              <a href="#">Verify your school enrollments</a>
            </Breadcrumbs>
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
