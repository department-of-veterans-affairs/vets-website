import React, { useMemo, useEffect } from 'react';
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
import { useNotificationSettingsUtils } from '@@profile/hooks';

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

const NotificationSettings = ({
  emailAddress,
  facilities,
  fetchNotificationSettings,
  mobilePhoneNumber,
  shouldShowAPIError,
  shouldShowLoadingIndicator,
}) => {
  const location = useLocation();

  const {
    showEmail,
    useAvailableGroups,
    toggles,
  } = useNotificationSettingsUtils();

  const requiredContactInfoOnFile = useMemo(
    () => {
      return showEmail
        ? !!(emailAddress || mobilePhoneNumber)
        : !!mobilePhoneNumber;
    },
    [emailAddress, mobilePhoneNumber, showEmail],
  );

  const showMissingContactInfoAlert = useMemo(
    () =>
      !shouldShowLoadingIndicator &&
      !shouldShowAPIError &&
      !requiredContactInfoOnFile,
    [requiredContactInfoOnFile, shouldShowAPIError, shouldShowLoadingIndicator],
  );

  const shouldFetchNotificationSettings = useMemo(
    () => {
      return !showMissingContactInfoAlert && !shouldShowAPIError;
    },
    [showMissingContactInfoAlert, shouldShowAPIError],
  );

  useEffect(
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

  useEffect(
    () => {
      if (shouldFetchNotificationSettings) {
        fetchNotificationSettings({
          facilities,
        });
      }
    },
    [fetchNotificationSettings, shouldFetchNotificationSettings],
  );

  const availableGroups = useAvailableGroups();

  const shouldShowNotificationGroups = useMemo(
    () => {
      return (
        !shouldShowAPIError &&
        !showMissingContactInfoAlert &&
        !shouldShowLoadingIndicator &&
        availableGroups.length > 0
      );
    },
    [
      shouldShowAPIError,
      showMissingContactInfoAlert,
      shouldShowLoadingIndicator,
      availableGroups,
    ],
  );

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
          showEmailNotificationSettings={showEmail}
        />
      )}
      {shouldShowNotificationGroups && (
        <>
          <FieldHasBeenUpdatedAlert />
          <ContactInfoOnFile
            emailAddress={emailAddress}
            mobilePhoneNumber={mobilePhoneNumber}
            showEmailNotificationSettings={showEmail}
          />
          <MissingContactInfoExpandable
            showEmailNotificationSettings={showEmail}
          />
          <hr aria-hidden="true" />
          {availableGroups.map(({ id }) => {
            // we handle the health care group a little differently
            if (id === NOTIFICATION_GROUPS.YOUR_HEALTH_CARE) {
              return (
                <NotificationGroup groupId={id} key={id}>
                  <HealthCareGroupSupportingText />
                </NotificationGroup>
              );
            }
            // this will hide the Payments header when there are no items to display
            if (
              id === NOTIFICATION_GROUPS.PAYMENTS &&
              !toggles.profileShowNewBenefitOverpaymentDebtNotificationSetting &&
              !toggles.profileShowNewHealthCareCopayBillNotificationSetting &&
              !mobilePhoneNumber
            ) {
              return null;
            }
            return <NotificationGroup groupId={id} key={id} />;
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
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
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
  shouldShowAPIError: PropTypes.bool,
};

const mapStateToProps = state => {
  const communicationPreferencesState = selectCommunicationPreferences(state);
  const hasVAPServiceError = hasVAPServiceConnectionError(state);
  const hasLoadingError = !!communicationPreferencesState.loadingErrors;
  const emailAddress = selectVAPEmailAddress(state);
  const mobilePhoneNumber = selectVAPMobilePhone(state);
  const shouldShowAPIError = hasVAPServiceError || hasLoadingError;
  const facilities = selectPatientFacilities(state);

  return {
    emailAddress,
    facilities,
    mobilePhoneNumber,
    notificationGroups: selectGroups(communicationPreferencesState),
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
