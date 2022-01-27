/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';

class EnrollmentVerificationPage extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  // componentDidMount() {
  // }

  render() {
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
                (or both) under the Post-9/11 GI Bill, you’ll need to verify
                your enrollment each month. If you don’t verify your enrollment
                for two months in a row, we will pause your monthly education
                payments.
              </p>

              <va-alert
                close-btn-aria-label="Close notification"
                status="success"
                visible
              >
                You’re up-to-date with your monthly enrollment verification.
                You’ll be able to verify your enrollment next month on [Month
                Day Year].
              </va-alert>

              <br />
              <va-alert
                close-btn-aria-label="Close notification"
                status="warning"
                visible
              >
                <h3 slot="headline">
                  We're missing one or more of your enrollment verifications
                </h3>
                <p>
                  You'll need to verify your monthly enrollments to get your
                  scheduled payments.
                </p>
                <a
                  className="vads-c-action-link--blue"
                  href="/enrollment-history/verify-enrollments"
                >
                  Verify your enrollments
                </a>
              </va-alert>

              <h2>Your monthly enrollment verifications</h2>

              <va-additional-info trigger="What if I notice an error with my enrollment information?">
                <ul>
                  <li>
                    Work with your School Certifying Official (SCO) to make sure
                    they have the correct enrollment information and can update
                    the information on file.
                  </li>
                  <li>
                    After your information is corrected, verify the corrected
                    information.
                  </li>
                </ul>
                <p>
                  If you notice a mistake, it’s best if you reach out to your
                  SCO soon. The sooner VA knows about changes to your
                  enrollment, the less likely you are to be overpaid and incur a
                  debt.
                </p>
              </va-additional-info>
              <p>
                Showing 1-10 of 53 monthly enrollments listed by most recent
              </p>

              <div className="ev-enrollment-month">
                <hr />
                <h3>October 2021</h3>
                <p>You verified this month</p>
                <va-additional-info trigger="More information">
                  <p>
                    <strong>[Start date] &ndash; [End date]</strong> at Wake
                    Forest University School of Business
                  </p>
                  <p>
                    <strong>Total credit hours:</strong> [#]
                  </p>
                  <p>
                    <strong>[Start date] &ndash; [End date]</strong> at
                    Adirondack Community College
                  </p>
                  <p>
                    <strong>Total credit hours:</strong>
                    [#]
                  </p>
                </va-additional-info>
              </div>

              <div className="ev-enrollment-month">
                <hr />
                <h3>September 2021</h3>
                <p>You verified this month</p>
                <va-additional-info trigger="More information">
                  <p>
                    <strong>[Start date] &ndash; [End date]</strong> at Wake
                    Forest University School of Business
                  </p>
                  <p>
                    <strong>Total credit hours:</strong> [#]
                  </p>
                  <p>
                    <strong>[Start date] &ndash; [End date]</strong> at
                    Adirondack Community College
                  </p>
                  <p>
                    <strong>Total credit hours:</strong>
                    [#]
                  </p>
                </va-additional-info>
              </div>

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
  }
}

function mapStateToProps(state) {
  const test = state.test;
  return { test };
}

export default connect(
  mapStateToProps,
  // matchDispatchToProps,
)(EnrollmentVerificationPage);

export { EnrollmentVerificationPage };
