import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';

import { setData } from 'platform/forms-system/src/js/actions';
import { getStoredSubTask } from 'platform/forms/sub-task';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import {
  getContestableIssues as getContestableIssuesAction,
  FETCH_CONTESTABLE_ISSUES_INIT,
} from '../actions';

import formConfig from '../config/form';
import {
  removeNonSelectedIssuesFromEvidence,
  evidenceNeedsUpdating,
} from '../utils/evidence';

import ITFWrapper from './ITFWrapper';
import { WIP } from '../components/WIP';
import {
  DATA_DOG_ID,
  DATA_DOG_TOKEN,
  DATA_DOG_SERVICE,
  SUPPORTED_BENEFIT_TYPES_LIST,
} from '../constants';

import { useBrowserMonitoring } from '../../shared/utils/useBrowserMonitoring';
import {
  issuesNeedUpdating,
  processContestableIssues,
} from '../../shared/utils/issues';

export const App = ({
  loggedIn,
  location,
  children,
  formData,
  setFormData,
  router,
  // savedForms,
  getContestableIssues,
  contestableIssues,
  legacyCount,
  isLoadingFeatures,
  accountUuid,
  inProgressFormId,
  show995,
}) => {
  // Make sure we're only loading issues once - see
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/33931
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);

  const subTaskBenefitType =
    formData?.benefitType || getStoredSubTask()?.benefitType;

  useEffect(
    () => {
      // Set user account & application id in Sentry so we can access their form
      // data for any thrown errors
      if (accountUuid && inProgressFormId) {
        Sentry.setTag('account_uuid', accountUuid);
        Sentry.setTag('in_progress_form_id', inProgressFormId);
      }
    },
    [accountUuid, inProgressFormId],
  );

  useEffect(
    () => {
      if (
        show995 &&
        SUPPORTED_BENEFIT_TYPES_LIST.includes(subTaskBenefitType)
      ) {
        // form data is reset after logging in and from the save-in-progress data,
        // so get it from the session storage
        if (!formData.benefitType) {
          setFormData({
            ...formData,
            benefitType: subTaskBenefitType,
          });
        } else if (loggedIn && formData.benefitType) {
          if (!isLoadingIssues && (contestableIssues.status || '') === '') {
            // load benefit type contestable issues
            setIsLoadingIssues(true);
            getContestableIssues({ benefitType: formData.benefitType });
          } else if (
            issuesNeedUpdating(
              contestableIssues.issues,
              formData?.contestedIssues,
            ) ||
            contestableIssues.legacyCount !== formData.legacyCount
          ) {
            // resetStoredSubTask();
            setFormData({
              ...formData,
              contestedIssues: processContestableIssues(
                contestableIssues.issues,
              ),
              legacyCount: contestableIssues.legacyCount,
            });
          } else if (evidenceNeedsUpdating(formData)) {
            // update evidence issues
            setFormData(removeNonSelectedIssuesFromEvidence(formData));
          }
        }
      }
    },
    [
      contestableIssues,
      formData,
      getContestableIssues,
      isLoadingIssues,
      legacyCount,
      loggedIn,

      setFormData,
      subTaskBenefitType,
      show995,
    ],
  );

  const wrapInH1 = content => (
    <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      {content}
    </h1>
  );

  let content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <ITFWrapper
        loggedIn={loggedIn}
        pathname={location.pathname}
        title={formConfig.title}
        benefitType={subTaskBenefitType}
        router={router}
        accountUuid={accountUuid}
        inProgressFormId={inProgressFormId}
      >
        {children}
      </ITFWrapper>
    </RoutedSavableApp>
  );

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring({
    loggedIn,
    formId: 'sc', // becomes "scBrowserMonitoringEnabled" feature flag
    version: '1.0.0',
    // record 100% of staging sessions, but only 10% of production
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 10,
    applicationId: DATA_DOG_ID,
    clientToken: DATA_DOG_TOKEN,
    service: DATA_DOG_SERVICE,
  });

  if (isLoadingFeatures) {
    return wrapInH1(<va-loading-indicator message="Loading application..." />);
  }
  if (!show995) {
    return <WIP />;
  }

  if (!SUPPORTED_BENEFIT_TYPES_LIST.includes(subTaskBenefitType)) {
    router.push('/start');
    content = wrapInH1(
      <va-loading-indicator message="Please wait while we restart the application for you." />,
    );
  } else if (
    loggedIn &&
    ((contestableIssues.status || '') === '' ||
      contestableIssues.status === FETCH_CONTESTABLE_ISSUES_INIT)
  ) {
    content = wrapInH1(
      <va-loading-indicator
        set-focus
        message="Loading your previous decisions..."
      />,
    );
  }

  return (
    <article id="form-0995" data-location={`${location?.pathname?.slice(1)}`}>
      {content}
    </article>
  );
};

App.propTypes = {
  getContestableIssues: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  accountUuid: PropTypes.string,
  children: PropTypes.any,
  contestableIssues: PropTypes.shape({
    status: PropTypes.string,
    issues: PropTypes.array,
    legacyCount: PropTypes.number,
  }),
  formData: PropTypes.shape({
    additionalIssues: PropTypes.array,
    areaOfDisagreement: PropTypes.array,
    benefitType: PropTypes.string,
    contestedIssues: PropTypes.array,
    legacyCount: PropTypes.number,
  }),
  inProgressFormId: PropTypes.number,
  isLoadingFeatures: PropTypes.bool,
  legacyCount: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    vapContactInfo: PropTypes.shape({}),
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  savedForms: PropTypes.array,
  show995: PropTypes.bool,
  testSetTag: PropTypes.func,
};

const mapStateToProps = state => ({
  accountUuid: state?.user?.profile?.accountUuid,
  inProgressFormId: state?.form?.loadedData?.metadata?.inProgressFormId,
  loggedIn: isLoggedIn(state),
  formData: state.form?.data || {},
  savedForms: state.user?.profile?.savedForms || [],
  contestableIssues: state.contestableIssues || {},
  legacyCount: state.legacyCount || 0,
  isLoadingFeatures: toggleValues(state).loading,
  show995: toggleValues(state)[FEATURE_FLAG_NAMES.supplementalClaim] || false,
});

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
