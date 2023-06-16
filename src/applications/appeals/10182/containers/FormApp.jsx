import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

// **** temporary code ****
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
// **** end temporary code ****

import formConfig from '../config/form';
import {
  noticeOfDisagreementFeature,
  issuesNeedUpdating,
  getSelected,
  getIssueNameAndDate,
  processContestableIssues,
} from '../utils/helpers';

import { copyAreaOfDisagreementOptions } from '../utils/disagreement';

import { showWorkInProgress } from '../content/WorkInProgressMessage';

import { getContestableIssues as getContestableIssuesAction } from '../actions';

export const FormApp = ({
  isLoading,
  loggedIn,
  showNod,
  location,
  children,
  formData,
  setFormData,
  getContestableIssues,
  contestableIssues = {},
  // **** temporary code ****
  disableSubmit,
  // **** end temporary code ****
}) => {
  // **** temporary code ****
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/58229
  useEffect(
    () => {
      if (
        loggedIn &&
        disableSubmit &&
        location?.pathname === '/review-and-submit'
      ) {
        const timer = setInterval(() => {
          const submit = document.querySelector(
            '.form-progress-buttons .usa-button-primary',
          );
          if (submit) {
            submit.disabled = true;
            clearInterval(timer);
          }
        }, 50);
      }
    },
    [loggedIn, disableSubmit, location?.pathname],
  );
  // **** end temporary code ****

  // Update profile data changes in the form data dynamically
  useEffect(
    () => {
      if (showNod && loggedIn) {
        const areaOfDisagreement = getSelected(formData);
        if (!contestableIssues?.status) {
          getContestableIssues();
        } else if (
          issuesNeedUpdating(
            contestableIssues?.issues,
            formData.contestableIssues,
          )
        ) {
          setFormData({
            ...formData,
            contestableIssues: processContestableIssues(
              contestableIssues?.issues,
            ),
          });
        } else if (
          areaOfDisagreement?.length !== formData.areaOfDisagreement?.length ||
          !areaOfDisagreement.every(
            (entry, index) =>
              getIssueNameAndDate(entry) ===
              getIssueNameAndDate(formData.areaOfDisagreement[index]),
          )
        ) {
          setFormData({
            ...formData,
            // save existing settings
            areaOfDisagreement: copyAreaOfDisagreementOptions(
              areaOfDisagreement,
              formData.areaOfDisagreement,
            ),
          });
        }
      }
    },
    [
      showNod,
      loggedIn,
      formData,
      setFormData,
      contestableIssues,
      getContestableIssues,
    ],
  );

  let content = isLoading ? (
    <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      <va-loading-indicator set-focus message="Loading application..." />
    </h1>
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  if (showNod === false) {
    content = showWorkInProgress(formConfig);
  }

  return (
    <article id="form-10182" data-location={`${location?.pathname?.slice(1)}`}>
      {content}
    </article>
  );
};

FormApp.propTypes = {
  children: PropTypes.object,
  contestableIssues: PropTypes.shape({
    issues: PropTypes.array,
    status: PropTypes.string,
  }),
  // **** temporary code ****
  disableSubmit: PropTypes.bool,
  // **** end temporary code ****
  formData: PropTypes.shape({
    areaOfDisagreement: PropTypes.array,
    contestableIssues: PropTypes.array,
  }),
  getContestableIssues: PropTypes.func,
  isLoading: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    vapContactInfo: PropTypes.shape({}),
  }),
  setFormData: PropTypes.func,
  showNod: PropTypes.bool,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const formData = state.form?.data || {};
  const showNod = noticeOfDisagreementFeature(state);
  const isLoading = state.featureToggles?.loading;
  const loggedIn = isLoggedIn(state);
  const { contestableIssues } = state;
  // **** temporary code ****
  // accidently named the feature flag with HLR instead of NOD
  const disableSubmit =
    toggleValues(state)[FEATURE_FLAG_NAMES.hlrDisableSubmit] || false;
  return {
    disableSubmit,
    profile,
    formData,
    showNod,
    contestableIssues,
    isLoading,
    loggedIn,
  };
  // **** end temporary code ****
  // return { profile, formData, showNod, contestableIssues, isLoading, loggedIn };
};

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
