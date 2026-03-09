import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import {
  BlockedTriageAlertStyles,
  ParentComponent,
  Recipients,
} from '../../util/constants';
import {
  getBlockedTriageAlertConfig,
  getAnalyticsAlertType,
} from '../../util/blockedTriageGroupUtils';

const DATADOG_FIND_VA_FACILITY_LINK =
  'Find your VA health facility link - in Blocked/Not Associated alert';

/**
 * BlockedTriageGroupAlert displays an alert when the user has blocked triage groups
 * or has lost associations with care teams.
 *
 * The alert logic is determined by the `getBlockedTriageAlertConfig` utility which
 * evaluates the recipients state and returns the appropriate alert configuration.
 *
 * @see src/applications/mhv-secure-messaging/util/blockedTriageGroupUtils.js
 */
const BlockedTriageGroupAlert = ({
  alertStyle,
  parentComponent,
  currentRecipient,
  setShowBlockedTriageGroupAlert,
  isOhMessage,
}) => {
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const recipients = useSelector(state => state.sm?.recipients);
  const analyticsRef = useRef(false);

  let userFacilityMigratingToOh = false;
  let migratingFacilities = [];
  let isInErrorPhase = false;
  const userProfile = useSelector(state => state.user.profile);
  if (
    userProfile.userAtPretransitionedOhFacility ||
    userProfile.userFacilityMigratingToOh
  ) {
    userFacilityMigratingToOh = userProfile?.userFacilityMigratingToOh;
    migratingFacilities =
      userProfile?.migrationSchedules?.length > 0
        ? userProfile?.migrationSchedules
        : [];
    const config = CernerAlertContent.SECURE_MESSAGING;
    isInErrorPhase = migratingFacilities.some(migration =>
      config.errorPhases?.includes(migration.phases.current),
    );
  }

  // Compute alert configuration using the centralized utility
  const alertConfig = useMemo(
    () =>
      getBlockedTriageAlertConfig({
        recipients,
        currentRecipient,
        parentComponent,
        ehrDataByVhaId,
        isOhMessage,
        facilityMigratingToOhInErrorPhase:
          userFacilityMigratingToOh && isInErrorPhase,
      }),
    [
      recipients,
      currentRecipient,
      parentComponent,
      ehrDataByVhaId,
      isOhMessage,
      userFacilityMigratingToOh,
      isInErrorPhase,
    ],
  );

  // Notify parent when alert should be shown
  useEffect(
    () => {
      if (alertConfig?.shouldShow && setShowBlockedTriageGroupAlert) {
        setShowBlockedTriageGroupAlert(true);
      }
    },
    [alertConfig?.shouldShow, setShowBlockedTriageGroupAlert],
  );

  // Track analytics (once per alert)
  useEffect(
    () => {
      if (
        alertConfig?.shouldShow &&
        alertConfig?.title &&
        !analyticsRef.current
      ) {
        const analyticsType = getAnalyticsAlertType(alertConfig.title);
        datadogRum.addAction('Blocked triage group alert', {
          type: analyticsType,
        });
        analyticsRef.current = true;
      }
    },
    [alertConfig],
  );

  // Don't render if no alert should be shown or title is missing
  if (!alertConfig?.shouldShow || !alertConfig?.title) {
    return null;
  }

  const { title, message, blockedList } = alertConfig;
  const { allTriageGroupsBlocked } = recipients || {};

  // Determine if we should show the blocked teams list
  const showBlockedList =
    (parentComponent === ParentComponent.COMPOSE_FORM ||
      parentComponent === ParentComponent.CONTACT_LIST) &&
    !allTriageGroupsBlocked &&
    blockedList?.length > 1;

  // Render expandable alert (used for warning style in forms)
  if (alertStyle === BlockedTriageAlertStyles.ALERT) {
    return (
      <va-alert-expandable
        status="warning"
        trigger={title}
        data-testid="blocked-triage-group-alert"
        data-dd-privacy="mask"
        data-dd-action-name="Blocked Triage Group Alert Expandable"
      >
        <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
          <p className="vads-u-margin-bottom--1p5">{message}</p>
          {showBlockedList && (
            <ul>
              {blockedList.map((item, index) => (
                <li
                  data-testid="blocked-triage-group"
                  key={item.id || item.name || index}
                  data-dd-privacy="mask"
                  data-dd-action-name="Blocked/Not Associated alert - expandable"
                >
                  {item.type === Recipients.FACILITY
                    ? `Care teams at ${item.suggestedNameDisplay || item.name}`
                    : item.suggestedNameDisplay || item.name}
                </li>
              ))}
            </ul>
          )}
          <VaLinkAction
            data-dd-action-name={`${DATADOG_FIND_VA_FACILITY_LINK} - expandable`}
            href="/find-locations/"
            text="Find your VA health facility"
          />
        </div>
      </va-alert-expandable>
    );
  }

  // Render standard alert (info or warning status)
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      class="vads-u-margin-bottom--2"
      status={alertStyle}
      visible
      data-testid="blocked-triage-group-alert"
    >
      <h2 slot="headline" data-dd-action-name="Blocked/Not Associated alert">
        {title}
      </h2>
      <div>
        <p className="vads-u-margin-bottom--1p5">{message}</p>
        <VaLinkAction
          data-dd-action-name={`${DATADOG_FIND_VA_FACILITY_LINK}`}
          href="/find-locations/"
          text="Find your VA health facility"
        />
      </div>
    </va-alert>
  );
};

BlockedTriageGroupAlert.propTypes = {
  alertStyle: PropTypes.string,
  currentRecipient: PropTypes.object,
  isOhMessage: PropTypes.bool,
  parentComponent: PropTypes.string,
  setShowBlockedTriageGroupAlert: PropTypes.func,
};

export default BlockedTriageGroupAlert;
