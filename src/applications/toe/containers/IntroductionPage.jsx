// src/applications/toe/containers/IntroductionPage.jsx

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import IntroductionLogin from '../components/IntroductionLogin';

import { getAppData } from '../selectors';

export const IntroductionPage = ({
  route,
  user,
  showMeb54901990eTextUpdate,
}) => {
  return (
    <div className="schemaform-intro">
      {showMeb54901990eTextUpdate ? (
        <>
          <h1>Apply to use transferred education benefits</h1>
          <h2 className="vads-u-font-size--h3">
            Equal to VA Form 22-1990e (Application for Family Member to Use
            Transferred Benefits)
          </h2>

          <p>Use VA Form 22-1990e if both of these are true for you:</p>
          <ul>
            <li>You’re the dependent of a Veteran or service member</li>
            <li>
              The Veteran or service member has already transferred Post-9/11 GI
              Bill benefits to you
            </li>
          </ul>

          <p>
            <strong>Note:</strong> If you use our online tool to apply, be sure
            you’re signed in as a family member to your own ID.me or Login.gov
            account to complete this application. We can’t process your
            application if the Veteran or service member signs in to their
            account and submits the application for you.
          </p>

          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
          >
            <div>
              If you are a Veteran or service member claiming a benefit based on
              your own service, this may not be the right benefit for you.{' '}
              <a
                target="_blank"
                href="https://www.va.gov/education/other-va-education-benefits"
                rel="noreferrer"
              >
                Learn more about other education benefits
              </a>
            </div>
          </va-alert>

          <h2 className="vads-u-font-size--h3">
            Follow these steps to get started
          </h2>

          <div className="process schemaform-process">
            <ol>
              <li className="process-step list-one">
                <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
                <p>
                  You must be a spouse or child of a sponsor who has transferred
                  a benefit to you in order to receive this benefit.
                </p>
                <p>
                  If this isn’t the right benefit for you,{' '}
                  <a href="https://www.va.gov/education/other-va-education-benefits/">
                    learn more about other education benefits
                  </a>
                  .
                </p>
              </li>
              <li className="process-step list-two">
                <h3 className="vads-u-font-size--h4">
                  Gather your information
                </h3>
                <p>
                  <strong>Here’s what you’ll need to apply:</strong>
                </p>
                <ul>
                  <li>
                    Your sponsor’s transferred GI Bill benefits. Make sure your
                    sponsor has transferred GI bill benefits before starting
                    this application. Your sponsor can{' '}
                    <a href="https://milconnect.dmdc.osd.mil/milconnect/">
                      update this information on the DoD milConnect website
                    </a>
                    .
                  </li>
                  <li>Your current address and contact information</li>
                  <li>Bank account direct deposit information</li>
                </ul>
              </li>
              <li className="process-step list-three">
                <h3 className="vads-u-font-size--h4">Start your application</h3>
                <p>
                  We’ll take you through each step of the process. It should
                  take about 15 minutes.
                </p>

                <va-additional-info trigger="What happens after I apply?">
                  <p>
                    After you apply, you may get an automatic decision. If we
                    approve your application, you’ll be able to download your
                    Certificate of Eligibility (or award letter) right away. If
                    we deny your application, you can download your denial
                    letter. We’ll also mail you a copy of your decision letter.
                  </p>
                  <br />
                  <p className="vads-u-margin-bottom--0">
                    <strong>Note:</strong> In some cases, we may need more time
                    to make a decision. If you don’t get an automatic decision
                    right after you apply, you’ll receive a decision letter in
                    the mail in about 30 days. We’ll contact you if we need more
                    information.
                  </p>
                </va-additional-info>
              </li>
            </ol>
          </div>
        </>
      ) : (
        // === original content unchanged ===
        <>
          <h1>Apply to use transferred education benefits</h1>
          <h2 className="vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--2p5">
            Equal to VA Form 22-1990e (Application for Family Member to Use
            Transferred Benefits)
          </h2>

          <p className="vads-u-margin-top--4">
            <strong>Note:</strong> This application is only for{' '}
            <strong>Transfer of Entitlement for Post-9/11 GI Bill</strong>{' '}
            (Chapter 33) education benefits.
          </p>

          <h2 className="vads-u-font-size--h3">
            Follow these steps to get started
          </h2>

          <div className="process schemaform-process">
            <ol>
              <li className="process-step list-one">
                <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
                <p>
                  In order to receive this benefit, you must be a spouse or
                  child of a sponsor who has transferred a benefit to you.
                </p>
                <p>
                  If this isn’t the right benefit for you,{' '}
                  <a href="https://www.va.gov/education/eligibility/">
                    learn more about other education benefits
                  </a>
                  .
                </p>
              </li>
              <li className="process-step list-two">
                <h3 className="vads-u-font-size--h4">
                  Gather your information
                </h3>
                <p>
                  <strong>Here’s what you’ll need to apply</strong>:
                </p>
                <ul>
                  <li>Your sponsor’s military service history</li>
                  <li>Your current address and contact information</li>
                  <li>Your bank account direct deposit information</li>
                </ul>
                <p className="vads-u-margin-bottom--0">
                  <strong>Note</strong>: If you aren’t legally an adult (at
                  least 18 years old), your parent or guardian must sign your
                  application.
                </p>
              </li>
              <li className="process-step list-three">
                <h3 className="vads-u-font-size--h4">Start your application</h3>
                <p>
                  We’ll take you through each step of the process. It should
                  take about 15 minutes.
                </p>

                <va-additional-info trigger="What happens after I apply?">
                  <p>
                    After you apply, you may get an automatic decision. If we
                    approve or deny your application, you’ll be able to download
                    your decision letter right away. We’ll also mail you a copy
                    of your decision letter.
                  </p>
                  <br />
                  <p className="vads-u-margin-bottom--0">
                    <strong>Note</strong>: In some cases, we may need more time
                    to make a decision. If you don’t get an automatic decision
                    right after you apply, you’ll receive a decision letter in
                    the mail in about 30 days. We’ll contact you if we need more
                    information.
                  </p>
                </va-additional-info>
              </li>
            </ol>
          </div>
        </>
      )}

      <IntroductionLogin route={route} />

      <div
        className={`omb-info--container vads-u-padding--0 vads-u-margin-top--${
          user?.login?.currentlyLoggedIn ? '4' : '2p5'
        } vads-u-margin-bottom--2`}
      >
        <va-omb-info
          res-burden="15"
          omb-number="2900-0154"
          exp-date="03/31/2026"
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  isPersonalInfoFetchFailed: state.data.isPersonalInfoFetchFailed || false,
  showMeb1990EMaintenanceAlert:
    state?.featureToggles[featureFlagNames.showMeb1990EZMaintenanceAlert],
  showMeb54901990eTextUpdate:
    state?.featureToggles[featureFlagNames.showMeb54901990eTextUpdate],
});

export default connect(mapStateToProps)(IntroductionPage);

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }).isRequired,
  showMeb54901990eTextUpdate: PropTypes.bool,
  user: PropTypes.object,
};
