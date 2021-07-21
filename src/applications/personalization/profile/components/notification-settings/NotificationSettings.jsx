import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import {
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import { PROFILE_PATH_NAMES } from '@@profile/constants';
import { fetchCommunicationPreferenceGroups } from '@@profile/ducks/communicationPreferences';

import { LOADING_STATES } from '../../../common/constants';
import Headline from '../ProfileSectionHeadline';
import ContactInfoOnFile from './ContactInfoOnFile';
import APIErrorAlert from './APIErrorAlert';
import MissingContactInfoAlert from './MissingContactInfoAlert';

const NotificationSettings = ({
  allContactInfoOnFile,
  fetchPrefs,
  emailAddress,
  mobilePhoneNumber,
  noContactInfoOnFile,
  shouldFetchNotificationSettings,
  shouldShowAPIError,
  shouldShowLoadingIndicator,
}) => {
  React.useEffect(() => {
    document.title = `Notification Settings | Veterans Affairs`;
  }, []);

  React.useEffect(
    () => {
      if (shouldFetchNotificationSettings) {
        fetchPrefs();
      }
    },
    [fetchPrefs, shouldFetchNotificationSettings],
  );

  // if either phone number or email address is not set
  const showMissingContactInfoAlert = React.useMemo(
    () =>
      !shouldShowLoadingIndicator &&
      !shouldShowAPIError &&
      !allContactInfoOnFile,
    [allContactInfoOnFile, shouldShowAPIError, shouldShowLoadingIndicator],
  );

  // shown as long as we aren't loading data and they have at least one
  // communication channel on file
  const showContactInfoOnFile = React.useMemo(
    () => {
      return (
        !shouldShowLoadingIndicator &&
        !shouldShowAPIError &&
        !noContactInfoOnFile
      );
    },
    [noContactInfoOnFile, shouldShowAPIError, shouldShowLoadingIndicator],
  );

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}</Headline>
      {shouldShowLoadingIndicator ? (
        <LoadingIndicator message="We’re loading your information." />
      ) : null}
      {shouldShowAPIError ? <APIErrorAlert /> : null}
      {showMissingContactInfoAlert ? (
        <MissingContactInfoAlert
          missingMobilePhone={!mobilePhoneNumber}
          missingEmailAddress={!emailAddress}
        />
      ) : null}
      {showContactInfoOnFile ? (
        <ContactInfoOnFile
          emailAddress={emailAddress}
          mobilePhoneNumber={mobilePhoneNumber}
        />
      ) : null}
    </>
  );
};

NotificationSettings.propTypes = {};

const mapStateToProps = state => {
  const communicationPreferencesState = state.communicationPreferences;
  const hasVAPServiceError = hasVAPServiceConnectionError(state);
  const hasLoadingError = !!communicationPreferencesState.loadingErrors;

  const emailAddress = selectVAPEmailAddress(state);
  const mobilePhoneNumber = selectVAPMobilePhone(state);
  const noContactInfoOnFile = !emailAddress && !mobilePhoneNumber;
  const allContactInfoOnFile = emailAddress && mobilePhoneNumber;
  const shouldFetchNotificationSettings =
    !noContactInfoOnFile && !hasVAPServiceError;
  const shouldShowAPIError = hasVAPServiceError || hasLoadingError;
  return {
    allContactInfoOnFile,
    emailAddress,
    mobilePhoneNumber,
    noContactInfoOnFile,
    shouldShowAPIError,
    shouldFetchNotificationSettings,
    shouldShowLoadingIndicator:
      communicationPreferencesState.loadingStatus === LOADING_STATES.pending,
  };
};

const mapDispatchToProps = {
  fetchPrefs: fetchCommunicationPreferenceGroups,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
