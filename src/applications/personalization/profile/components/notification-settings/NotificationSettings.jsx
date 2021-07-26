import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import {
  hasVAPServiceConnectionError,
  isVAPatient,
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';
import { focusElement } from '~/platform/utilities/ui';

import { PROFILE_PATH_NAMES } from '@@profile/constants';
import {
  fetchCommunicationPreferenceGroups,
  selectGroups,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { LOADING_STATES } from '../../../common/constants';

import APIErrorAlert from './APIErrorAlert';
import ContactInfoOnFile from './ContactInfoOnFile';
import Headline from '../ProfileSectionHeadline';
import HealthCareGroupSupportingText from './HealthCareGroupSupportingText';
import MissingContactInfoAlert from './MissingContactInfoAlert';
import NotificationGroup from './NotificationGroup';

const NotificationSettings = ({
  allContactInfoOnFile,
  emailAddress,
  fetchCurrentSettings,
  isPatient,
  mobilePhoneNumber,
  noContactInfoOnFile,
  notificationGroups,
  shouldFetchNotificationSettings,
  shouldShowAPIError,
  shouldShowLoadingIndicator,
}) => {
  React.useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Notification Settings | Veterans Affairs`;
  }, []);

  React.useEffect(
    () => {
      if (shouldFetchNotificationSettings) {
        fetchCurrentSettings();
      }
    },
    [fetchCurrentSettings, shouldFetchNotificationSettings],
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
      {!shouldShowLoadingIndicator
        ? notificationGroups.ids.map(groupId => {
            if (groupId === 'group3') {
              if (!isPatient) {
                return null;
              } else {
                return (
                  <NotificationGroup groupId={groupId} key={groupId}>
                    <HealthCareGroupSupportingText />
                  </NotificationGroup>
                );
              }
            } else {
              return <NotificationGroup groupId={groupId} key={groupId} />;
            }
          })
        : null}
    </>
  );
};

NotificationSettings.propTypes = {};

const mapStateToProps = state => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
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
    isPatient: isVAPatient(state),
    mobilePhoneNumber,
    noContactInfoOnFile,
    notificationGroups: selectGroups(communicationPreferencesState),
    shouldFetchNotificationSettings,
    shouldShowAPIError,
    shouldShowLoadingIndicator:
      communicationPreferencesState.loadingStatus === LOADING_STATES.pending,
  };
};

const mapDispatchToProps = {
  fetchCurrentSettings: fetchCommunicationPreferenceGroups,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
