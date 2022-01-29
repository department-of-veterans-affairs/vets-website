/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

class VerifyEnrollmentsPage extends React.Component {
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
                <a href="#">Verify your enrollments</a>
              </Breadcrumbs>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              <h1>Verify your enrollments</h1>

              <va-segmented-progress-bar current={1} total={2} />

              <h2>Step 1 of 2: Verify September 2021</h2>

              <va-alert
                background-only
                close-btn-aria-label="Close notification"
                status="info"
                visible
              >
                We skipped you ahead to the review step because you selected
                "No, this information isn't correct" for September 2021.
              </va-alert>

              <br />

              <va-alert
                background-only
                close-btn-aria-label="Close notification"
                show-icon
                status="warning"
                visible
              >
                <va-additional-info trigger="If you submit this verification, we'll pause your monthly education payments">
                  <p>
                    If you submit this verification, we will pause your monthly
                    payments until your enrollment information is corrected.
                  </p>
                  <p>
                    You can update your enrollment information before you submit
                    your verification:
                  </p>
                  <ul>
                    <li>
                      Work with your School Certifying Official (SCO) to make
                      sure they have the correct enrollment information and can
                      update the information on file.
                    </li>
                    <li>
                      After your information is corrected, verify the corrected
                      information.
                    </li>
                  </ul>
                </va-additional-info>
              </va-alert>

              <br />

              <div className="ev-highlighted-content-container">
                <header className="ev-highlighted-content-container_header">
                  <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
                    September 2021
                  </h1>
                </header>
                <div className="ev-highlighted-content-container_content">
                  <p>
                    This is the enrollment information we have on file for you
                    for September 2021.
                  </p>
                  <div className="ev-info-block">
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
                  </div>
                </div>
              </div>

              <RadioButtons
                errorMessage=""
                label="This is a Label"
                onKeyDown={function noRefCheck() {}}
                onMouseDown={function noRefCheck() {}}
                onValueChange={function noRefCheck() {}}
                options={[
                  'Yes, this information is correct',
                  "No, this information isn't correct",
                ]}
                required
                value={{
                  value: 'First option',
                }}
              />

              <va-alert
                close-btn-aria-label="Close notification"
                status="warning"
                visible
              >
                If you select, "No this information isn't correct,"{' '}
                <strong>
                  we'll pause your monthly payments until you update your
                  enrollment information.
                </strong>{' '}
                You also won't be able to verify any future enrollments until
                you update your information.
              </va-alert>

              <button
                type="button"
                className="usa-button-secondary"
                id="1-continueButton"
              >
                <span className="button-icon" aria-hidden="true">
                  «&nbsp;
                </span>
                Back
              </button>
              <button
                type="submit"
                className="usa-button-primary"
                id="2-continueButton"
              >
                Continue
                <span className="button-icon" aria-hidden="true">
                  &nbsp;»
                </span>
              </button>
            </div>
          </div>
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
)(VerifyEnrollmentsPage);

export { VerifyEnrollmentsPage };
