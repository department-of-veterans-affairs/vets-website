import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import {
  hasVAPServiceConnectionError,
  isVAPatient,
  // TODO: uncomment when email is a supported communication channel
  // selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';
import { focusElement } from '~/platform/utilities/ui';

import { PROFILE_PATH_NAMES } from '@@profile/constants';
import {
  fetchCommunicationPreferenceGroups,
  selectChannelsWithoutSelection,
  selectAvailableGroups,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import { LOADING_STATES } from '../../../common/constants';

import APIErrorAlert from './APIErrorAlert';
import ContactInfoOnFile from './ContactInfoOnFile';
import Headline from '../ProfileSectionHeadline';
import HealthCareGroupSupportingText from './HealthCareGroupSupportingText';
import MissingContactInfoAlert from './MissingContactInfoAlert';
import NotificationGroup from './NotificationGroup';

const SelectNotificationOptionsAlert = ({ firstChannelId }) => {
  return (
    <div data-testid="select-options-alert">
      <va-alert status="warning">
        <h2 slot="headline">Select your notification options</h2>
        <p>
          We’ve added notification options to your profile. Tell us how you’d
          like us to contact you.
        </p>
        <p>
          <a
            href={`#${firstChannelId}`}
            className="vads-u-text-decoration--none vads-u-padding--1 vads-u-margin-left--neg1 vads-u-margin-top--neg1 vads-u-margin-bottom--neg1"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />{' '}
            Select your notification options
          </a>
        </p>
      </va-alert>
    </div>
  );
};

const NotificationSettings = ({
  allContactInfoOnFile,
  emailAddress,
  fetchCurrentSettings,
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
      {showContactInfoOnFile ? (
        <ContactInfoOnFile
          emailAddress={emailAddress}
          mobilePhoneNumber={mobilePhoneNumber}
        />
      ) : null}
      {showContactInfoOnFile
        ? notificationGroups.ids.map(groupId => {
            // we handle the health care group a little differently
            // TODO: I don't like this check. what does `group3` even mean?
            if (groupId === 'group3') {
              return (
                <NotificationGroup groupId={groupId} key={groupId}>
                  <HealthCareGroupSupportingText />
                </NotificationGroup>
              );
            } else {
              return <NotificationGroup groupId={groupId} key={groupId} />;
            }
          })
        : null}
      {showContactInfoOnFile ? (
        <p className="vads-u-margin-bottom--0">
          <strong>Note:</strong> We have limited notification options at this
          time. Check back for more options in the future.
        </p>
      ) : null}
    </>
  );
};

NotificationSettings.propTypes = {};

const mapStateToProps = state => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const hasVAPServiceError = hasVAPServiceConnectionError(state);
  const hasLoadingError = !!communicationPreferencesState.loadingErrors;

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
  const isPatient = isVAPatient(state);
  return {
    allContactInfoOnFile,
    emailAddress,
    mobilePhoneNumber,
    noContactInfoOnFile,
    notificationGroups: selectAvailableGroups(communicationPreferencesState, {
      isPatient,
    }),
    unselectedChannels: selectChannelsWithoutSelection(
      communicationPreferencesState,
      {
        isPatient,
        hasEmailAddress: !!emailAddress,
        hasMobilePhone: !!mobilePhoneNumber,
      },
    ),
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
