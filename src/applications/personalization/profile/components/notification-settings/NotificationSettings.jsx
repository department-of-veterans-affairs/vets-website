import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { animateScroll as scroll } from 'react-scroll';
import { useLocation } from 'react-router-dom';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { NOTIFICATION_GROUPS, PROFILE_PATH_NAMES } from '@@profile/constants';
import {
  fetchCommunicationPreferenceGroups,
  selectGroups,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';

import {
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';

import { LOADING_STATES } from '../../../common/constants';

import LoadFail from '../alerts/LoadFail';
import ContactInfoOnFile from './ContactInfoOnFile';
import Headline from '../ProfileSectionHeadline';
import HealthCareGroupSupportingText from './HealthCareGroupSupportingText';
import MissingContactInfoAlert from './MissingContactInfoAlert';
import NotificationGroup from './NotificationGroup';
import { FieldHasBeenUpdated as FieldHasBeenUpdatedAlert } from '../alerts/FieldHasBeenUpdated';
import { MissingContactInfoExpandable } from './MissingContactInfoExpandable';
import { useNotificationSettingsUtils } from '../../hooks/useNotifcationSettingsFilters';

const NotificationSettings = ({
  allContactInfoOnFile,
  emailAddress,
  facilities,
  fetchNotificationSettings,
  mobilePhoneNumber,
  noContactInfoOnFile,
  notificationGroups,
  shouldFetchNotificationSettings,
  shouldShowAPIError,
  shouldShowLoadingIndicator,
}) => {
  const location = useLocation();

  const {
    toggles: notificationToggles,
    getReducedGroups,
  } = useNotificationSettingsUtils();

  React.useEffect(
    () => {
      // issue: 48011
      // used via passed state from contact info - mobile update alert link
      if (location.state?.scrollToTop) {
        scroll.scrollToTop({ duration: 0, smooth: false });
      }

      focusElement('[data-focus-target]');
      document.title = `Notification Settings | Veterans Affairs`;
    },
    [location.state?.scrollToTop],
  );

  React.useEffect(
    () => {
      if (shouldFetchNotificationSettings && !notificationToggles.loading) {
        fetchNotificationSettings({
          facilities,
        });
      }
    },
    [
      fetchNotificationSettings,
      shouldFetchNotificationSettings,
      notificationToggles,
    ],
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

  const reducedNotificationGroups = getReducedGroups(notificationGroups);

  // console.log({ channelsWithContactInfo, reducedNotificationGroups });

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}</Headline>
      {shouldShowLoadingIndicator && (
        <VaLoadingIndicator
          data-testid="loading-indicator"
          message="We’re loading your information."
        />
      )}
      {shouldShowAPIError && <LoadFail />}
      {showMissingContactInfoAlert && (
        <MissingContactInfoAlert
          missingMobilePhone={!mobilePhoneNumber}
          missingEmailAddress={!emailAddress}
          showEmailNotificationSettings={
            notificationToggles.showEmailNotificationSettings
          }
        />
      )}
      {showNotificationOptions && (
        <>
          <FieldHasBeenUpdatedAlert />
          <ContactInfoOnFile
            emailAddress={emailAddress}
            mobilePhoneNumber={mobilePhoneNumber}
            showEmailNotificationSettings={
              notificationToggles.showEmailNotificationSettings
            }
          />
          <MissingContactInfoExpandable />
          {reducedNotificationGroups.ids.map(groupId => {
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
      )}
    </>
  );
};

NotificationSettings.propTypes = {
  fetchNotificationSettings: PropTypes.func.isRequired,
  noContactInfoOnFile: PropTypes.bool.isRequired,
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
  allContactInfoOnFile: PropTypes.object,
  emailAddress: PropTypes.string,
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      facilityId: PropTypes.string,
      isCerner: PropTypes.bool,
    }),
  ),
  mobilePhoneNumber: PropTypes.object,
  notificationGroups: PropTypes.shape({
    entities: PropTypes.object,
    ids: PropTypes.arrayOf(PropTypes.string),
  }),
  shouldFetchNotificationSettings: PropTypes.bool,
  shouldShowAPIError: PropTypes.bool,
};

const mapStateToProps = state => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const hasVAPServiceError = hasVAPServiceConnectionError(state);
  const hasLoadingError = !!communicationPreferencesState.loadingErrors;
  const emailAddress = selectVAPEmailAddress(state);
  const mobilePhoneNumber = selectVAPMobilePhone(state);
  const noContactInfoOnFile = !emailAddress && !mobilePhoneNumber;
  // TODO: uncomment when email is a supported notification channel
  // const allContactInfoOnFile = emailAddress && mobilePhoneNumber;
  const allContactInfoOnFile = mobilePhoneNumber && emailAddress;
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
    shouldFetchNotificationSettings,
    shouldShowAPIError,
    shouldShowLoadingIndicator:
      communicationPreferencesState.loadingStatus === LOADING_STATES.pending,
  };
};

const mapDispatchToProps = {
  fetchNotificationSettings: fetchCommunicationPreferenceGroups,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);

export const NotificationSettingsUnconnected = NotificationSettings;
