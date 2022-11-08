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
}) => {
  const location = useLocation();

  React.useEffect(() => {
    // issue: 48011
    // used via passed state from contact info - mobile update alert link
    if (location.state?.scrollToTop) {
      scroll.scrollToTop({ duration: 0, smooth: false });
    }

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

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}</Headline>
      {shouldShowLoadingIndicator ? (
        <VaLoadingIndicator
          data-testid="loading-indicator"
          message="We’re loading your information."
        />
      ) : null}
      {shouldShowAPIError ? <APIErrorAlert /> : null}
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

NotificationSettings.propTypes = {
  fetchNotificationSettings: PropTypes.func.isRequired,
  noContactInfoOnFile: PropTypes.bool.isRequired,
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
  shouldShowPaymentsNotificationSetting: PropTypes.bool.isRequired,
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
