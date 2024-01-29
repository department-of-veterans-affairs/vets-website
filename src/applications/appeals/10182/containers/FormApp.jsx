import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import { getContestableIssues as getContestableIssuesAction } from '../actions';
import formConfig from '../config/form';
import {
  SHOW_PART3,
  SHOW_PART3_REDIRECT,
  DATA_DOG_ID,
  DATA_DOG_TOKEN,
  DATA_DOG_SERVICE,
} from '../constants';
import { nodPart3UpdateFeature } from '../utils/helpers';
import { issuesNeedUpdating } from '../utils/issues';
import { getEligibleContestableIssues } from '../utils/submit';
import { checkRedirect } from '../utils/redirect';

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
  returnUrlFromSIPForm,
  isStartingOver,
}) => {
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
      }
    },
    [loggedIn, formData, setFormData],
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

  useEffect(
    () => {
      // Checking returnUrlFromSIPForm to ensure the redirect occurs _after_ the save-in-
      // progress response has loaded; and saving this check to form data to
      // ensure that this check & redirect only occurs once & the state is saved
      // in the form data so it doesn't occur again if the Veteran returns later
      const formDataIsLoadedInReduxStore = !!returnUrlFromSIPForm;
      const weHaveNeverCheckedWhetherVeteranNeedsToBeRedirected = !formData[
        SHOW_PART3_REDIRECT
      ];

      if (
        showPart3 &&
        formDataIsLoadedInReduxStore &&
        weHaveNeverCheckedWhetherVeteranNeedsToBeRedirected
      ) {
        // Redirect back to part 3 question if Veteran is on or past the
        // contestable issues page
        const needsRedirect = checkRedirect(returnUrlFromSIPForm);

        // Using "redirected" for the resulting page to show an info alert so
        // the Veteran knows why they were redirected.
        // **This is just the updating the redux store. It takes further Veteran action (e.g. focus, blur, but not clicking back or continue).
        setFormData({
          ...formData,
          // Setting 'redirected' to indicate that we are about to redirect them.
          [SHOW_PART3_REDIRECT]:
            !isStartingOver && needsRedirect ? 'redirected' : 'not-needed',
        });
      }
      // Add feature flag to form data to be used within the form
      if (showPart3 !== formData[SHOW_PART3]) {
        setFormData({
          ...formData,
          [SHOW_PART3]: showPart3,
        });
      }
    },
    // Include formData[SHOW_PART3] in dependencies because the save-in-progress
    // will over-write the value when starting a new form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showPart3, returnUrlFromSIPForm, formData[SHOW_PART3]],
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
    applicationId: DATA_DOG_ID,
    clientToken: DATA_DOG_TOKEN,
    service: DATA_DOG_SERVICE,
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
  isStartingOver: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  returnUrlFromSIPForm: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setFormData: PropTypes.func,
  showPart3: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  showPart3: nodPart3UpdateFeature(state),
  contestableIssues: state.contestableIssues,
  isLoading: state.featureToggles?.loading,
  loggedIn: isLoggedIn(state),
  returnUrlFromSIPForm: state.form?.loadedData?.metadata?.returnUrl,
  isStartingOver: state.form.isStartingOver,
});

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
