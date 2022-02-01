/* eslint-disable react/prefer-stateless-function */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';

import { fetchVerificationStatus } from '../actions';

import EnrollmentVerificationAlert from '../components/EnrollmentVerificationAlert';
import EnrollmentVerificationMonths from '../components/EnrollmentVerificationMonths';

export const EnrollmentVerificationPage = ({
  verificationStatus,
  getVerificationStatus,
}) => {
  // constructor(props) {
  //   super(props);
  // }

  // componentDidMount() {
  // }

  useEffect(
    () => {
      if (!verificationStatus) {
        getVerificationStatus();
      }
    },
    [verificationStatus],
  );

  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <Breadcrumbs>
              <a href="/">Home</a>
              <a href="#">Education and training</a>
              <a href="#">Enrollment verifications</a>
            </Breadcrumbs>
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <h1>Enrollment Verification</h1>
            <p className="va-introtext">
              If you get a monthly housing allowance (MHA) or kicker payments
              (or both) under the Post-9/11 GI Bill, you’ll need to verify your
              enrollment each month. If you don’t verify your enrollment for two
              months in a row, we will pause your monthly education payments.
            </p>

            <EnrollmentVerificationAlert status={verificationStatus} />

            <EnrollmentVerificationMonths status={verificationStatus} />

            <Pagination
              onPageSelect={function noRefCheck() {}}
              page={1}
              pages={5}
            />

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
          </div>
        </div>

        <va-back-to-top />
      </div>
    </>
  );
};

const mapStateToProps = state => {
  const verificationStatus = state.data.verificationStatus;
  return { verificationStatus };
};

const mapDispatchToProps = {
  getVerificationStatus: fetchVerificationStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationPage);
