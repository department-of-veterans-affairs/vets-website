import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { getStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import RoutedSavableApp from '~/platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from '~/platform/user/selectors';
import { setData } from '~/platform/forms-system/src/js/actions';

import { getContestableIssues as getContestableIssuesAction } from '../actions';

import formConfig from '../config/form';
import {
  removeNonSelectedIssuesFromEvidence,
  evidenceNeedsUpdating,
} from '../utils/evidence';

import ITFWrapper from './ITFWrapper';
import {
  DATA_DOG_ID,
  DATA_DOG_TOKEN,
  DATA_DOG_SERVICE,
  SUPPORTED_BENEFIT_TYPES_LIST,
  SC_NEW_FORM_TOGGLE,
  SC_NEW_FORM_DATA,
} from '../constants';

import { FETCH_CONTESTABLE_ISSUES_SUCCEEDED } from '../../shared/actions';
import { wrapInH1 } from '../../shared/content/intro';
import { wrapWithBreadcrumb } from '../../shared/components/Breadcrumbs';
import { useBrowserMonitoring } from '../../shared/utils/useBrowserMonitoring';
import {
  issuesNeedUpdating,
  processContestableIssues,
} from '../../shared/utils/issues';
import { isOutsideForm } from '../../shared/utils/helpers';

import { data995 } from '../../shared/props';

export const App = ({
  loggedIn,
  location,
  children,
  formData,
  setFormData,
  router,
  getContestableIssues,
  contestableIssues,
  legacyCount,
  accountUuid,
  inProgressFormId,
  toggles,
}) => {
  const { pathname } = location || {};
  // Make sure we're only loading issues once - see
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/33931
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);

  const subTaskBenefitType =
    formData?.benefitType || getStoredSubTask()?.benefitType;

  const hasSupportedBenefitType = SUPPORTED_BENEFIT_TYPES_LIST.includes(
    subTaskBenefitType,
  );

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
      if (hasSupportedBenefitType) {
        // form data is reset after logging in and from the save-in-progress data,
        // so get it from the session storage
        if (!formData.benefitType) {
          setFormData({
            ...formData,
            benefitType: subTaskBenefitType,
          });
        } else if (
          loggedIn &&
          // internalTesting is used to test the get contestable issues API call
          // in unit tests; Setting up the unit test to get RoutedSavableApp to
          // work properly is overly complicated
          (!isOutsideForm(pathname) || formData.internalTesting) &&
          formData.benefitType
        ) {
          if (!isLoadingIssues && (contestableIssues.status || '') === '') {
            // load benefit type contestable issues
            setIsLoadingIssues(true);
            getContestableIssues({ benefitType: formData.benefitType });
          } else if (
            contestableIssues.status === FETCH_CONTESTABLE_ISSUES_SUCCEEDED &&
            (issuesNeedUpdating(
              contestableIssues.issues,
              formData?.contestedIssues,
            ) ||
              contestableIssues.legacyCount !== formData.legacyCount)
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
      hasSupportedBenefitType,
      isLoadingIssues,
      legacyCount,
      loggedIn,
      setFormData,
      subTaskBenefitType,
      pathname,
    ],
  );

  useEffect(
    () => {
      const isUpdated = toggles[SC_NEW_FORM_TOGGLE] || false;
      if (
        !toggles.loading &&
        (typeof formData[SC_NEW_FORM_DATA] === 'undefined' ||
          formData[SC_NEW_FORM_DATA] !== isUpdated)
      ) {
        setFormData({
          ...formData,
          [SC_NEW_FORM_DATA]: isUpdated,
        });
        // temp storage, used for homelessness page focus management
        sessionStorage.setItem('hlrUpdated', isUpdated);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggles, formData[SC_NEW_FORM_DATA]],
  );

  let content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <ITFWrapper
        loggedIn={loggedIn}
        pathname={pathname}
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

  // Go to start page if we don't have an expected benefit type
  if (!pathname.endsWith('/start') && !hasSupportedBenefitType) {
    router.push('/start');
    content = wrapInH1(
      <va-loading-indicator
        set-focus
        message="Please wait while we restart the application for you."
      />,
    );
  }

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

  return wrapWithBreadcrumb(
    'sc',
    <article id="form-0995" data-location={`${pathname?.slice(1)}`}>
      {content}
    </article>,
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
  formData: data995,
  inProgressFormId: PropTypes.number,
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
  toggles: PropTypes.shape({
    [SC_NEW_FORM_TOGGLE]: PropTypes.bool,
    loading: PropTypes.bool,
  }),
};

const mapStateToProps = state => ({
  accountUuid: state?.user?.profile?.accountUuid,
  inProgressFormId: state?.form?.loadedData?.metadata?.inProgressFormId,
  loggedIn: isLoggedIn(state),
  formData: state.form?.data || {},
  savedForms: state.user?.profile?.savedForms || [],
  contestableIssues: state.contestableIssues || {},
  legacyCount: state.legacyCount || 0,
  toggles: state.featureToggles || {},
});

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
