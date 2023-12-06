import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { getAppData } from '../selectors/selectors';

function HowToApplyPost911GiBillV2({
  formId,
  isClaimantCallComplete,
  isEligibilityCallComplete,
  isLOA3,
  isLoggedIn,
  savedForms,
  showMebEnhancements09,
  route,
  user,
}) {
  const apiCallsComplete = isClaimantCallComplete && isEligibilityCallComplete;
  const savedForm = savedForms?.find(f => f.form === formId);

  return (
    <>
      <p className="vads-u-margin-top--4">
        <strong>Note</strong>: At this time, you can only apply for{' '}
        <strong>Post-9/11 GI Bill®</strong> (Chapter 33) benefits through this
        application. If you want to apply for other education benefits,{' '}
        <a href="/education/eligibility">
          find out what you may be eligible for
        </a>
        .
      </p>

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

HowToApplyPost911GiBillV2.propTypes = {
  route: PropTypes.object.isRequired,
  formId: PropTypes.string,
  isClaimantCallComplete: PropTypes.bool,
  isEligibilityCallComplete: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
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
});

export default connect(mapStateToProps)(HowToApplyPost911GiBillV2);
