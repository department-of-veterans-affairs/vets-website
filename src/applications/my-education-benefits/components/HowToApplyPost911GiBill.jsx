import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { getAppData } from '../selectors/selectors';

function HowToApplyPost911GiBill({
  formId,
  isClaimantCallComplete,
  isLOA3,
  isLoggedIn,
  savedForms,
  showMebEnhancements09,
  meb160630Automation,
  route,
  user,
}) {
  const apiCallsComplete = isClaimantCallComplete;
  const savedForm = savedForms?.find(f => f.form === formId);

  const renderNote = () => {
    if (meb160630Automation) {
      return (
        <p className="vads-u-margin-top--4">
          <strong>Note</strong>: This application is only for these 3 education
          benefits: <br />
          <strong>Post-9/11 GI Bill®</strong> (Chapter 33) <br />
          <strong>Montgomery GI Bill® Active Duty</strong> (Chapter 30) <br />
          <strong>Montgomery GI Bill® Selective Reserve</strong> (Chapter 1606){' '}
          <br />
        </p>
      );
    }
    return (
      <p className="vads-u-margin-top--4">
        <strong>Note</strong>: At this time, you can only apply for{' '}
        <strong>Post-9/11 GI Bill®</strong> (Chapter 33) benefits through this
        application. If you want to apply for other education benefits,{' '}
        <a href="/education/eligibility">
          find out what you may be eligible for
        </a>
        .
      </p>
    );
  };

  return (
    <>
      {renderNote()}

      {isLoggedIn &&
        !savedForm &&
        ((!showMebEnhancements09 && apiCallsComplete && isLOA3) ||
          (showMebEnhancements09 && isLOA3 && !showMebEnhancements09)) && (
          <SaveInProgressIntro
            buttonOnly
            pageList={route.pageList}
            prefillEnabled={route?.formConfig?.prefillEnabled}
            startText="Start your application"
            user={user}
          />
        )}
    </>
  );
}

HowToApplyPost911GiBill.propTypes = {
  route: PropTypes.object.isRequired,
  formId: PropTypes.string,
  isClaimantCallComplete: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  meb160630Automation: PropTypes.bool,
  savedForms: PropTypes.arrayOf(
    PropTypes.shape({
      form: PropTypes.string,
    }),
  ),
  showMebEnhancements09: PropTypes.bool, // Added new feature flag to propTypes
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  showMebEnhancements09:
    state.featureToggles[featureFlagNames.showMebEnhancements09],
  meb160630Automation:
    state.featureToggles[featureFlagNames.meb160630Automation],
});

export default connect(mapStateToProps)(HowToApplyPost911GiBill);
