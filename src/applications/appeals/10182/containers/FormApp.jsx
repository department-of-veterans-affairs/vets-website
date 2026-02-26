import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  getContestableIssues as getContestableIssuesAction,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
} from '../../shared/actions';
import formConfig from '../config/form';
import { DATA_DOG_ID, DATA_DOG_TOKEN, DATA_DOG_SERVICE } from '../constants';
import { wrapWithBreadcrumb } from '../../shared/components/Breadcrumbs';
import { copyAreaOfDisagreementOptions } from '../../shared/utils/areaOfDisagreement';
import { useBrowserMonitoring } from '../../shared/utils/useBrowserMonitoring';
import {
  getEligibleContestableIssues,
  getSelected,
  getIssueNameAndDate,
  issuesNeedUpdating,
} from '../../shared/utils/issues';
import { isOutsideForm } from '../../shared/utils/helpers';

export const FormApp = ({
  isLoading,
  loggedIn,
  location,
  children,
  formData,
  setFormData,
  getContestableIssues,
  contestableIssues = {},
}) => {
  const { pathname } = location || {};

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

      if (
        (contestableIssues?.status || '') === '' &&
        // internalTesting is used to test the get contestable issues API call
        // in unit tests; Setting up the unit test to get RoutedSavableApp to
        // work properly is overly complicated
        (!isOutsideForm(pathname) || formData.internalTesting)
      ) {
        getContestableIssues({ appAbbr: 'NOD' });
      } else if (
        // Checks if the API has returned contestable issues not already reflected
        // in `formData`.
        contestableIssues.status === FETCH_CONTESTABLE_ISSUES_SUCCEEDED &&
        issuesNeedUpdating(contestableIssues?.issues, formData.contestedIssues)
      ) {
        setFormData({
          ...formData,
          // Filters and normalizes the issues. See function definition for more
          // details.
          contestedIssues: getEligibleContestableIssues(
            contestableIssues?.issues,
            { isNod: true },
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
    [loggedIn, contestableIssues, formData.contestedIssues, pathname],
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
    version: '1.0.0',
    applicationId: DATA_DOG_ID,
    clientToken: DATA_DOG_TOKEN,
    service: DATA_DOG_SERVICE,
  });

  return wrapWithBreadcrumb(
    'nod',
    <article id="form-10182" data-location={`${pathname?.slice(1)}`}>
      {content}
    </article>,
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
    internalTesting: PropTypes.bool,
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
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  contestableIssues: state.contestableIssues,
  isLoading: state.featureToggles?.loading,
  loggedIn: isLoggedIn(state),
  returnUrlFromSIPForm: state.form?.loadedData?.metadata?.returnUrl,
  isStartingOver: state.form.isStartingOver,
  toggles: state.featureToggles || {},
});

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
