import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { getAppData } from '../selectors/selectors';

export const HowToApplyPost911GiBill = ({
  formId,
  isClaimantCallComplete,
  isLOA3,
  isLoggedIn,
  meb1995Reroute,
  route,
  savedForms,
  showTextUpdate,
  user,
}) => {
  const apiCallsComplete = isClaimantCallComplete;
  const savedForm = savedForms?.find(f => f.form === formId);

  return (
    <>
      {meb1995Reroute && (
        <>
          <p className="vads-u-margin-top--4">
            Use VA Form 22-1990 if you want to apply for education benefits for
            the first time or make changes to an existing benefit.
          </p>
          <p>
            <strong>
              For first time applicants, use the VA Form 22-1990 to apply for
              the following programs:
            </strong>
          </p>
          <ul>
            <li>
              <strong>Post-9/11 GI Bill®</strong> (Chapter 33)
            </li>
            <li>
              <strong>Montgomery GI Bill® Active Duty</strong> (Chapter 30)
            </li>
            <li>
              <strong>Montgomery GI Bill® Selected Reserve</strong> (Chapter
              1606)
            </li>
          </ul>
          <p>
            <strong>
              If you have applied for benefits before, use the VA Form 22-1990
              for these actions:
            </strong>
          </p>
          <ul>
            <li>
              Update your current benefit and get an updated Certificate of
              Eligibility (COE)
            </li>
            <li>Switch your existing education benefit and get a new COE</li>
          </ul>
        </>
      )}

      {!meb1995Reroute && showTextUpdate && (
        <>
          <p className="vads-u-margin-top--4">
            Use VA Form 22-1990 if you want to apply for education benefits
            under any of the following programs:
          </p>
          <p className="vads-u-margin-top--2">
            <strong>Post-9/11 GI Bill®</strong> (Chapter 33)
            <br />
            <strong>Montgomery GI Bill® Active Duty</strong> (Chapter 30)
            <br />
            <strong>Montgomery GI Bill® Selected Reserve</strong> (Chapter 1606)
          </p>
        </>
      )}

      {!meb1995Reroute && !showTextUpdate && (
        <p className="vads-u-margin-top--4">
          <strong>Note</strong>: This application is only for these 3 education
          benefits:
          <br />
          <strong>Post-9/11 GI Bill®</strong> (Chapter 33)
          <br />
          <strong>Montgomery GI Bill® Active Duty</strong> (Chapter 30)
          <br />
          <strong>Montgomery GI Bill® Selected Reserve</strong> (Chapter 1606)
          <br />
        </p>
      )}

      {isLoggedIn && !savedForm && apiCallsComplete && isLOA3 && (
        <SaveInProgressIntro
          buttonOnly
          pageList={route.pageList}
          prefillEnabled={route?.formConfig?.prefillEnabled}
          startText="Start your benefits application"
          user={user}
        />
      )}
    </>
  );
};

HowToApplyPost911GiBill.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({ prefillEnabled: PropTypes.bool }),
    pageList: PropTypes.array,
  }).isRequired,
  showTextUpdate: PropTypes.bool.isRequired,

  formId: PropTypes.string,
  isClaimantCallComplete: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  meb1995Reroute: PropTypes.bool,
  savedForms: PropTypes.arrayOf(
    PropTypes.shape({
      form: PropTypes.string,
    }),
  ),
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  ...getIntroState(state),
  ...getAppData(state),
  showTextUpdate: Boolean(
    state.featureToggles?.[featureFlagNames.showMeb54901990eTextUpdate],
  ),
});

export default connect(mapStateToProps)(HowToApplyPost911GiBill);
