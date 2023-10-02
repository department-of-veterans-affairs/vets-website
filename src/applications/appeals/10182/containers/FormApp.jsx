import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import { getContestableIssues as getContestableIssuesAction } from '../actions';
import formConfig from '../config/form';
import { SHOW_PART3 } from '../constants';
import { nodPart3UpdateFeature } from '../utils/helpers';
import { issuesNeedUpdating } from '../utils/issues';
import { getEligibleContestableIssues } from '../utils/submit';

import { copyAreaOfDisagreementOptions } from '../../shared/utils/areaOfDisagreement';
import { useBrowserMonitoring } from '../../shared/utils/useBrowserMonitoring';
import { getSelected, getIssueNameAndDate } from '../../shared/utils/issues';

export const FormApp = ({
  isLoading,
  loggedIn,
  showPart3,
  location,
  children,
  formData,
  setFormData,
  getContestableIssues,
  contestableIssues = {},
}) => {
  // Update profile data changes in the form data dynamically
  useEffect(
    () => {
      if (loggedIn) {
        const areaOfDisagreement = getSelected(formData);
        if (
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
        if (showPart3 && typeof formData[SHOW_PART3] === 'undefined') {
          setFormData({
            ...formData,
            [SHOW_PART3]: showPart3,
          });
        }
      }
    },
    [loggedIn, formData, setFormData, showPart3],
  );

  // This useEffect is responsible for 1) loading contestable issues from the API,
  // 2) filtering and normalizing that data, and 3) updating `formData` with that
  // filtered and normalized data, if it is not already reflected in `formData`.
  useEffect(
    () => {
      if (!loggedIn) {
        return;
      }

      if (!contestableIssues?.status) {
        getContestableIssues();
      } else if (
        // Checks if the API has returned contestable issues not already reflected
        // in `formData`.
        issuesNeedUpdating(
          contestableIssues?.issues,
          formData.contestedIssues,
          { showPart3 },
        )
      ) {
        setFormData({
          ...formData,
          // Filters and normalizes the issues. See function definition for more
          // details.
          contestedIssues: getEligibleContestableIssues(
            contestableIssues?.issues,
            {
              showPart3,
            },
          ),
        });
      }
    },
    // Disabling because we don't want this to run when `formData` changes. This
    // `useEffect` is all about filtering and normalizing new API-loaded contestable
    // issues. It would be needlessly inefficient to be doing this every single
    // time that the form data changes. Additionally, the functions used in this
    // `useEffect` (e.g. `setFormData`) never change, so we don't need to include
    // them in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn, contestableIssues, showPart3, formData.contestedIssues],
  );

  const content = isLoading ? (
    <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      <va-loading-indicator set-focus message="Loading application..." />
    </h1>
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring({
    loggedIn,
    formId: 'nod', // becomes "nodBrowserMonitoringEnabled" feature flag
    version: '1.0.0',
    applicationId: 'cabce133-7a68-46ba-ac9b-68c57e8375eb',
    clientToken: 'pubb208973905b7f32eb100b1c27688ecc9',
    service: 'benefits-notice-of-disagreement',
  });

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
  formData: PropTypes.shape({
    areaOfDisagreement: PropTypes.array,
    contestedIssues: PropTypes.array,
    [SHOW_PART3]: PropTypes.bool,
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
  showPart3: PropTypes.bool,
};

const mapStateToProps = state => ({
  profile: selectProfile(state),
  formData: state.form?.data || {},
  showPart3: nodPart3UpdateFeature(state),
  contestableIssues: state.contestableIssues,
  isLoading: state.featureToggles?.loading,
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
