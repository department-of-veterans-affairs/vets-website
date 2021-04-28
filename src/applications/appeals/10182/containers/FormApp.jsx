import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { noticeOfDisagreementFeature } from '../utils/helpers';
import { showWorkInProgress } from '../content/WorkInProgressMessage';

import { getContestableIssues as getContestableIssuesAction } from '../actions';

export const FormApp = ({
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
  const { email = {}, homePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};

  // Update profile data changes in the form data dynamically
  useEffect(
    () => {
      if (showNod && loggedIn) {
        const { veteran = {} } = formData || {};
        if (!contestableIssues?.status) {
          getContestableIssues();
        } else if (
          email?.emailAddress !== veteran.email ||
          homePhone?.updatedAt !== veteran.phone?.updatedAt ||
          mailingAddress?.updatedAt !== veteran.address?.updatedAt ||
          contestableIssues?.issues.length !== formData.contestableIssues.length
        ) {
          setFormData({
            ...formData,
            veteran: {
              ...veteran,
              address: mailingAddress,
              phone: homePhone,
              email: email?.emailAddress,
            },
            contestableIssues: contestableIssues?.issues || [],
          });
        }
      }
    },
    [
      showNod,
      loggedIn,
      email,
      homePhone,
      mailingAddress,
      formData,
      setFormData,
      contestableIssues,
      getContestableIssues,
    ],
  );

  return (
    <article id="form-10182" data-location={`${location?.pathname?.slice(1)}`}>
      {showNod ? (
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      ) : (
        showWorkInProgress(formConfig)
      )}
    </article>
  );
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const formData = state.form?.data || {};
  const showNod = noticeOfDisagreementFeature(state);
  const loggedIn = isLoggedIn(state);
  const { contestableIssues } = state;
  return { profile, formData, showNod, contestableIssues, loggedIn };
};

const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
