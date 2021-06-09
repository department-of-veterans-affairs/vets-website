import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile, isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import {
  noticeOfDisagreementFeature,
  issuesNeedUpdating,
  getSelected,
  getIssueName,
  copyAreaOfDisagreementOptions,
} from '../utils/helpers';

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
  const { email = {}, mobilePhone = {}, homePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};
  const phone = mobilePhone?.phoneNumber ? mobilePhone : homePhone;

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
          phone?.updatedAt !== veteran.phone?.updatedAt ||
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
              phone,
              email: email?.emailAddress,
            },
            contestableIssues: contestableIssues?.issues || [],
          });
        } else if (
          areaOfDisagreement?.length !== formData.areaOfDisagreement?.length ||
          !areaOfDisagreement.every(
            (entry, index) =>
              getIssueName(entry) ===
              getIssueName(formData.areaOfDisagreement[index]),
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
      phone,
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
