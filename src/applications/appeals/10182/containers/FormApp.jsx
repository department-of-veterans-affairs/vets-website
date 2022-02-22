import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

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
  profile,
  formData,
  setFormData,
  getContestableIssues,
  contestableIssues = {},
}) => {
  const { email = {}, mobilePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};

  // Update profile data changes in the form data dynamically
  useEffect(
    () => {
      if (showNod && loggedIn) {
        const { veteran = {} } = formData || {};
        const areaOfDisagreement = getSelected(formData);
        if (!contestableIssues?.status) {
          getContestableIssues();
        } else if (
          email?.emailAddress !== veteran.email ||
          mobilePhone?.updatedAt !== veteran.phone?.updatedAt ||
          mailingAddress?.updatedAt !== veteran.address?.updatedAt ||
          issuesNeedUpdating(
            contestableIssues?.issues,
            formData.contestableIssues,
          )
        ) {
          setFormData({
            ...formData,
            veteran: {
              ...veteran,
              address: mailingAddress,
              phone: mobilePhone,
              email: email?.emailAddress,
            },
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
      email,
      mobilePhone,
      mailingAddress,
      formData,
      setFormData,
      contestableIssues,
      getContestableIssues,
    ],
  );

  let content = isLoading ? (
    <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      <va-loading-indicator
        set-focus
        message="Loading your previous decisions..."
      />
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
  return { profile, formData, showNod, contestableIssues, isLoading, loggedIn };
};

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
