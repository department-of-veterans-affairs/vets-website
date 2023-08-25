import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';
import formConfig from '../config/form';
import { nodPart3UpdateFeature } from '../utils/helpers';
import { getEligibleContestableIssues } from '../utils/submit';

import { SHOW_PART3 } from '../constants';

import { getContestableIssues as getContestableIssuesAction } from '../actions';

import { copyAreaOfDisagreementOptions } from '../../shared/utils/areaOfDisagreement';

import {
  getSelected,
  getIssueNameAndDate,
  processContestableIssues,
  issuesNeedUpdating,
} from '../../shared/utils/issues';

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
        if (!contestableIssues?.status) {
          getContestableIssues();
        } else if (
          issuesNeedUpdating(
            contestableIssues?.issues,
            formData.contestedIssues,
          )
        ) {
          setFormData({
            ...formData,
            // getEligibleContestableIssues removes issues that are deferred,
            // missing a title, or have an invalid date, while
            // processContestableIssues sorts the issues
            contestedIssues: processContestableIssues(
              getEligibleContestableIssues(contestableIssues?.issues, {
                showPart3,
              }),
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
        if (showPart3 && typeof formData[SHOW_PART3] === 'undefined') {
          setFormData({
            ...formData,
            [SHOW_PART3]: showPart3,
          });
        }
      }
    },
    [
      loggedIn,
      formData,
      setFormData,
      contestableIssues,
      getContestableIssues,
      showPart3,
    ],
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
  useBrowserMonitoring();

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
