import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { NOTIFICATION_GROUPS, PROFILE_PATH_NAMES } from '@@profile/constants';
import {
  fetchCommunicationPreferenceGroups,
  selectChannelsWithoutSelection,
  selectGroups,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import { focusElement } from '~/platform/utilities/ui';
import {
  hasVAPServiceConnectionError,
  // TODO: uncomment when email is a supported communication channel
  // selectVAPEmailAddress,
  selectPatientFacilities,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import { LOADING_STATES } from '../../../common/constants';

import APIErrorAlert from './APIErrorAlert';
import ContactInfoOnFile from './ContactInfoOnFile';
import Headline from '../ProfileSectionHeadline';
import HealthCareGroupSupportingText from './HealthCareGroupSupportingText';
import MissingContactInfoAlert from './MissingContactInfoAlert';
import NotificationGroup from './NotificationGroup';
import SelectNotificationOptionsAlert from './SelectNotificationOptionsAlert';
import { selectShowPaymentsNotificationSetting } from '../../selectors';

const NotificationSettings = ({
  allContactInfoOnFile,
  emailAddress,
  facilities,
  fetchNotificationSettings,
  shouldShowPaymentsNotificationSetting,
  mobilePhoneNumber,
  noContactInfoOnFile,
  notificationGroups,
  shouldFetchNotificationSettings,
  shouldShowAPIError,
  shouldShowLoadingIndicator,
  unselectedChannels,
}) => {
  React.useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Notification Settings | Veterans Affairs`;
  }, []);

  React.useEffect(
    () => {
      if (shouldFetchNotificationSettings) {
        fetchNotificationSettings({ facilities });
      }
    },
    [fetchNotificationSettings, shouldFetchNotificationSettings],
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
  const showNotificationOptions = React.useMemo(
    () => {
      return (
        !shouldShowLoadingIndicator &&
        !shouldShowAPIError &&
        !noContactInfoOnFile
      );
    },
    [noContactInfoOnFile, shouldShowAPIError, shouldShowLoadingIndicator],
  );

  const firstChannelIdThatNeedsSelection = React.useMemo(
    () => {
      return !shouldShowLoadingIndicator && unselectedChannels.ids[0];
    },
    [shouldShowLoadingIndicator, unselectedChannels],
  );

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}</Headline>
      {shouldShowLoadingIndicator ? (
        <LoadingIndicator message="We’re loading your information." />
      ) : null}
      {shouldShowAPIError ? <APIErrorAlert /> : null}
      {firstChannelIdThatNeedsSelection ? (
        <SelectNotificationOptionsAlert
          firstChannelId={firstChannelIdThatNeedsSelection}
        />
      ) : null}
      {showMissingContactInfoAlert ? (
        <MissingContactInfoAlert
          missingMobilePhone={!mobilePhoneNumber}
          missingEmailAddress={!emailAddress}
        />
      ) : null}
      {showNotificationOptions ? (
        <>
          <ContactInfoOnFile
            emailAddress={emailAddress}
            mobilePhoneNumber={mobilePhoneNumber}
          />
          {notificationGroups.ids.map(groupId => {
            if (
              groupId === NOTIFICATION_GROUPS.PAYMENTS &&
              !shouldShowPaymentsNotificationSetting
            ) {
              return null;
            }

            // we handle the health care group a little differently
            if (groupId === NOTIFICATION_GROUPS.YOUR_HEALTH_CARE) {
              return (
                <NotificationGroup groupId={groupId} key={groupId}>
                  <HealthCareGroupSupportingText />
                </NotificationGroup>
              );
            }

            return <NotificationGroup groupId={groupId} key={groupId} />;
          })}
          <p className="vads-u-margin-bottom--0">
            <strong>Note:</strong> We have limited notification options at this
            time. Check back for more options in the future.
          </p>
        </>
      ) : null}
    </>
  );
};

NotificationSettings.propTypes = {};

const mapStateToProps = state => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const hasVAPServiceError = hasVAPServiceConnectionError(state);
  const hasLoadingError = !!communicationPreferencesState.loadingErrors;
  const shouldShowPaymentsNotificationSetting = selectShowPaymentsNotificationSetting(
    state,
  );

  // TODO: uncomment when email is a supported notification channel
  // const emailAddress = selectVAPEmailAddress(state);
  const emailAddress = null;
  const mobilePhoneNumber = selectVAPMobilePhone(state);
  const noContactInfoOnFile = !emailAddress && !mobilePhoneNumber;
  // TODO: uncomment when email is a supported notification channel
  // const allContactInfoOnFile = emailAddress && mobilePhoneNumber;
  const allContactInfoOnFile = mobilePhoneNumber;
  const shouldFetchNotificationSettings =
    !noContactInfoOnFile && !hasVAPServiceError;
  const shouldShowAPIError = hasVAPServiceError || hasLoadingError;
  const facilities = selectPatientFacilities(state);
  return {
    allContactInfoOnFile,
    emailAddress,
    facilities,
    mobilePhoneNumber,
    noContactInfoOnFile,
    notificationGroups: selectGroups(communicationPreferencesState),
    unselectedChannels: selectChannelsWithoutSelection(
      communicationPreferencesState,
      {
        hasEmailAddress: !!emailAddress,
        hasMobilePhone: !!mobilePhoneNumber,
      },
    ),
    shouldFetchNotificationSettings,
    shouldShowAPIError,
    shouldShowLoadingIndicator:
      communicationPreferencesState.loadingStatus === LOADING_STATES.pending,
    shouldShowPaymentsNotificationSetting,
  };
};

const mapDispatchToProps = {
  fetchNotificationSettings: fetchCommunicationPreferenceGroups,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
