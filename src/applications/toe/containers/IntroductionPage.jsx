import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import IntroductionLogin from '../components/IntroductionLogin';

import { getAppData } from '../selectors';
import { START_APPLICATION_TEXT } from '../constants';

export const IntroductionPage = ({
  isLOA3,
  isLoggedIn,
  isPersonalInfoFetchComplete,
  isPersonalInfoFetchFailed,
  isSponsorsFetchComplete,
  showMeb1990EMaintenanceAlert,
  route,
  user,
}) => {
  const apiCallsComplete =
    isPersonalInfoFetchComplete && isSponsorsFetchComplete;

  return (
    <div className="schemaform-intro">
      <h1>Apply to use transferred education benefits</h1>
      <h2 className="vads-u-font-size--h3 vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-top--2p5">
        Equal to VA Form 22-1990e (Application for Family Member to Use
        Transferred Benefits)
      </h2>

      <p className="vads-u-margin-top--4">
        <strong>Note:</strong> This application is only for{' '}
        <strong>Transfer of Entitlement for Post-9/11 GI Bill</strong> (Chapter
        33) education benefits.
      </p>

      {isLoggedIn &&
      isPersonalInfoFetchFailed === false && // Ensure the error didn't occur.
      showMeb1990EMaintenanceAlert === false && // Ensure the mainenance flag is not on.
        apiCallsComplete &&
        isLOA3 && (
          <SaveInProgressIntro
            buttonOnly
            user={user}
            prefillEnabled={route.formConfig.prefillEnabled}
            messages={route.formConfig.savedFormMessages}
            pageList={route.pageList}
            startText={START_APPLICATION_TEXT}
          />
        )}

      <h2 className="vads-u-font-size--h3">
        Follow these steps to get started
      </h2>

      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
            <p>
              In order to receive this benefit, you must be a spouse or child of
              a sponsor who has transferred a benefit to you.
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
            <h3 className="vads-u-font-size--h4">Gather your information</h3>
            <p>
              <strong>Here’s what you’ll need to apply</strong>:
            </p>
            <ul>
              <li>Your sponsor’s military service history</li>
              <li>Your current address and contact information</li>
              <li>Your bank account direct deposit information</li>
            </ul>
            <p className="vads-u-margin-bottom--0">
              <strong>Note</strong>: If you aren’t legally an adult (at least 18
              years old), your parent or guardian must sign your application.
            </p>
          </li>
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Start your application</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>

            <va-additional-info trigger="What happens after I apply?">
              <p>
                After you apply, you may get an automatic decision. If we
                approve or deny your application, you’ll be able to download
                your decision letter right away. We’ll also mail you a copy of
                your decision letter.
              </p>
              <p className="vads-u-margin-bottom--0">
                <strong>Note</strong>: In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. And we’ll contact you if we need more
                information.
              </p>
            </va-additional-info>
          </li>
        </ol>
      </div>

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
    state.featureToggles[featureFlagNames.showMeb1990EZMaintenanceAlert],
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
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isPersonalInfoFetchComplete: PropTypes.bool,
  isPersonalInfoFetchFailed: PropTypes.bool,
  isSponsorsFetchComplete: PropTypes.bool,
  showMeb1990EMaintenanceAlert: PropTypes.bool,
  user: PropTypes.object,
};
