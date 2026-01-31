import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from 'platform/utilities/scroll';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { PROFILE_PATH_NAMES, PROFILE_PATHS } from '@@profile/constants';
import {
  fetchCommunicationPreferenceGroups,
  selectGroups,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import {
  useContactInfoDeepLink,
  useNotificationSettingsUtils,
} from '@@profile/hooks';

import {
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { FIELD_NAMES, USA } from '@@vap-svc/constants';
import { LOADING_STATES } from '../../../common/constants';

import LoadFail from '../alerts/LoadFail';
import ContactInfoOnFile from './ContactInfoOnFile';
import Headline from '../ProfileSectionHeadline';
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

  const { generateContactInfoLink } = useContactInfoDeepLink();

  const updateMobileNumberHref = generateContactInfoLink({
    fieldName: FIELD_NAMES.MOBILE_PHONE,
    returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
  });

  const { showEmail, useAvailableGroups } = useNotificationSettingsUtils();

  const requiredContactInfoOnFile = useMemo(
    () => {
      // Target domestic numbers here to follow the original required contact info flow
      // The addition of international numbers has a separate flow of modals and alerts
      const domesticMobilePhone =
        mobilePhoneNumber && !mobilePhoneNumber.isInternational;
      return showEmail
        ? !!(emailAddress || domesticMobilePhone)
        : !!(mobilePhoneNumber && domesticMobilePhone);
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
        scrollToTop();
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

  const isInternationalMobile =
    mobilePhoneNumber &&
    mobilePhoneNumber.isInternational &&
    String(mobilePhoneNumber.countryCode) !== USA.COUNTRY_CODE;

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.NOTIFICATION_SETTINGS}</Headline>

      <DowntimeNotification
        appTitle="notification settings page"
        dependencies={[externalServices.VAPRO_NOTIFICATION_SETTINGS]}
      >
        {shouldShowLoadingIndicator && (
          <VaLoadingIndicator
            data-testid="loading-indicator"
            message="We’re loading your information."
          />
        )}
        {shouldShowAPIError && <LoadFail />}
        {!shouldShowLoadingIndicator &&
          !shouldShowAPIError && (
            <>
              {showMissingContactInfoAlert && (
                <MissingContactInfoAlert
                  missingMobilePhone={
                    mobilePhoneNumber || !mobilePhoneNumber?.isInternational
                  }
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
                  {isInternationalMobile && (
                    <va-alert-expandable
                      status="info"
                      trigger="You won't receive text notifications"
                      class="vads-u-margin-top--3"
                      data-testid="international-mobile-number-info-alert"
                    >
                      <p className="vads-u-padding-bottom--2">
                        We can’t send text notifications to international phone
                        numbers. Add a U.S. mobile phone number if you want to
                        receive these text notifications:
                      </p>
                      <ul className="vads-u-padding-bottom--2">
                        <li>Health appointment reminders</li>
                        <li>Prescription shipping notifications</li>
                        <li>Appeal status updates</li>
                        <li>Appeal hearing reminders</li>
                        <li>Disability and pension deposit notifications</li>
                      </ul>
                      <p>
                        <va-link
                          href={updateMobileNumberHref}
                          text="Update your mobile phone number"
                        />
                      </p>
                    </va-alert-expandable>
                  )}
                  <MissingContactInfoExpandable
                    showEmailNotificationSettings={showEmail}
                  />
                  <va-additional-info
                    data-testid="data-encryption-notice"
                    trigger="By setting up notifications, you agree to receive unsecure emails and texts"
                    class="vads-u-margin-top--3"
                  >
                    <p>
                      Data encryption is a way of making data hard to read by
                      people other than the intended recipient. SMS text
                      messaging and email aren’t encrypted. This means they’re
                      not secure. Other people could read your appointment
                      information if they get access to the messages when sent,
                      received, or on your phone or computer.
                    </p>
                    <p className="vads-u-padding-top--2">
                      <va-link
                        href="/privacy-policy/digital-notifications-terms-and-conditions/"
                        text="Read more about privacy and security for digital notifications"
                      />
                    </p>
                  </va-additional-info>
                  <hr aria-hidden="true" />
                  {availableGroups.map(({ id }) => (
                    <NotificationGroup groupId={id} key={id} />
                  ))}
                </>
              )}
            </>
          )}
      </DowntimeNotification>
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
