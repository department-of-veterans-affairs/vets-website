import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { datadogRum } from '@datadog/browser-rum';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  BlockedTriageAlertStyles,
  BlockedTriageAlertText,
  ParentComponent,
  RecipientStatus,
  Recipients,
} from '../../util/constants';
import {
  sortTriageList,
  updateTriageGroupRecipientStatus,
} from '../../util/helpers';

const { alertTitle, alertMessage } = BlockedTriageAlertText;
const MESSAGE_TO_CARE_TEAM = "You can't send messages to";
const MESSAGE_TO_CARE_TEAMS = "You can't send messages to care teams at";
const ACCOUNT_DISCONNECTED = 'Your account is no longer connected to';
const { MULTIPLE_TEAMS_BLOCKED, ALL_TEAMS_BLOCKED } = alertTitle;

const BlockedTriageGroupAlert = props => {
  const {
    alertStyle,
    parentComponent,
    currentRecipient,
    setShowBlockedTriageGroupAlert,
    isOhMessage,
  } = props;

  const DATADOG_FIND_VA_FACILITY_LINK =
    'Find your VA health facility link - in Blocked/Not Associated alert';

  const [alertTitleText, setAlertTitleText] = useState(null);
  const [alertInfoText, setAlertInfoText] = useState(
    alertMessage.NO_ASSOCIATIONS,
  );
  const [showAlert, setShowAlert] = useState(false);
  const [blockedTriageList, setBlockedTriageList] = useState([]);
  const [isAnalyticsSent, setIsAnalyticsSent] = useState(false);

  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const { recipients } = useSelector(state => state.sm);

  const {
    noAssociations,
    allTriageGroupsBlocked,
    associatedBlockedTriageGroupsQty,
    blockedRecipients,
    blockedFacilities,
  } = recipients;

  const handleShowBlockedTriageGroupAlert = useCallback(
    () => {
      if (setShowBlockedTriageGroupAlert) setShowBlockedTriageGroupAlert(true);
    },
    [setShowBlockedTriageGroupAlert],
  );

  const organizeBlockedList = (recipientList, facilityNames) => {
    return recipientList?.length > 1 && facilityNames.length > 0
      ? [
          ...sortTriageList(
            recipientList.filter(
              triageGroup =>
                !facilityNames?.some(
                  facility =>
                    facility.stationNumber === triageGroup.stationNumber,
                ),
            ),
          ),
          ...sortTriageList(facilityNames),
        ]
      : sortTriageList(recipientList);
  };

  useEffect(
    () => {
      const blockedFacilityNames =
        (blockedFacilities?.length > 0 &&
          blockedFacilities
            ?.filter(facility =>
              getVamcSystemNameFromVhaId(ehrDataByVhaId, facility),
            )
            .map(facility => {
              return {
                stationNumber: facility,
                name: getVamcSystemNameFromVhaId(ehrDataByVhaId, facility),
                type: Recipients.FACILITY,
              };
            })) ||
        [];
      if (associatedBlockedTriageGroupsQty !== undefined) {
        if (currentRecipient) {
          const { formattedRecipient } = updateTriageGroupRecipientStatus(
            recipients,
            currentRecipient,
          );

          if (formattedRecipient.status === RecipientStatus.NOT_ASSOCIATED) {
            if (blockedRecipients.length > 0) {
              const organizedList = organizeBlockedList(
                blockedRecipients,
                blockedFacilityNames,
              );
              setBlockedTriageList(
                sortTriageList([...organizedList, formattedRecipient]),
              );
            } else {
              setBlockedTriageList([formattedRecipient]);
            }
            if (!isOhMessage) {
              setShowAlert(true);
              handleShowBlockedTriageGroupAlert();
            }
          } else if (formattedRecipient.status === RecipientStatus.BLOCKED) {
            if (parentComponent === ParentComponent.COMPOSE_FORM) {
              const organizedList = organizeBlockedList(
                blockedRecipients,
                blockedFacilityNames,
              );

              if (organizedList.length > 0) {
                setBlockedTriageList([...organizedList]);
                setShowAlert(true);
                handleShowBlockedTriageGroupAlert();
              }
            } else {
              setBlockedTriageList([formattedRecipient]);
              setShowAlert(true);
              handleShowBlockedTriageGroupAlert();
            }
          }
        } else if (noAssociations || allTriageGroupsBlocked) {
          setShowAlert(true);
          handleShowBlockedTriageGroupAlert();
        } else if (
          parentComponent === ParentComponent.COMPOSE_FORM ||
          parentComponent === ParentComponent.CONTACT_LIST
        ) {
          const organizedList = organizeBlockedList(
            blockedRecipients,
            blockedFacilityNames,
          );

          if (organizedList.length > 0) {
            setBlockedTriageList([...organizedList]);
            setShowAlert(true);
            handleShowBlockedTriageGroupAlert();
          }
        }
      }
    },
    [
      currentRecipient,
      recipients,
      allTriageGroupsBlocked,
      associatedBlockedTriageGroupsQty,
      blockedFacilities,
      blockedRecipients,
      ehrDataByVhaId,
      noAssociations,
      parentComponent,
      handleShowBlockedTriageGroupAlert,
      isOhMessage,
    ],
  );

  useEffect(
    () => {
      if (associatedBlockedTriageGroupsQty !== undefined) {
        if (
          parentComponent === ParentComponent.FOLDER_HEADER ||
          parentComponent === ParentComponent.COMPOSE_FORM
        ) {
          if (noAssociations) {
            setAlertTitleText(alertTitle.NO_ASSOCIATIONS);
            return;
          }

          if (allTriageGroupsBlocked) {
            setAlertTitleText(alertTitle.ALL_TEAMS_BLOCKED);
            setAlertInfoText(alertMessage.ALL_TEAMS_BLOCKED);
            return;
          }
        }

        if (blockedTriageList?.length === 1) {
          const name =
            blockedTriageList[0].suggestedNameDisplay ||
            blockedTriageList[0].name;
          if (blockedTriageList[0].type === Recipients.FACILITY) {
            setAlertTitleText(`${MESSAGE_TO_CARE_TEAMS} ${name}`);
            setAlertInfoText(alertMessage.SINGLE_FACILITY_BLOCKED);
          } else {
            setAlertTitleText(
              blockedTriageList[0].status === RecipientStatus.NOT_ASSOCIATED
                ? `${ACCOUNT_DISCONNECTED} ${name}`
                : `${MESSAGE_TO_CARE_TEAM} ${name}`,
            );
            if (blockedTriageList[0].status === RecipientStatus.BLOCKED) {
              setAlertInfoText(alertMessage.SINGLE_TEAM_BLOCKED);
            } else {
              setAlertInfoText(alertMessage.NO_ASSOCIATIONS);
            }
          }
        } else if (noAssociations) {
          setAlertTitleText(alertTitle.NO_ASSOCIATIONS);
          setAlertInfoText(alertMessage.NO_ASSOCIATIONS);
        } else if (allTriageGroupsBlocked) {
          setAlertTitleText(alertTitle.ALL_TEAMS_BLOCKED);
          setAlertInfoText(alertMessage.ALL_TEAMS_BLOCKED);
        } else if (blockedTriageList?.length > 1) {
          setAlertTitleText(alertTitle.MULTIPLE_TEAMS_BLOCKED);
          setAlertInfoText(alertMessage.MULTIPLE_TEAMS_BLOCKED);
        }
      }
    },
    [
      allTriageGroupsBlocked,
      associatedBlockedTriageGroupsQty,
      blockedTriageList,
      noAssociations,
      parentComponent,
      recipients,
    ],
  );

  useEffect(
    () => {
      if (showAlert && alertTitleText && !isAnalyticsSent) {
        let value = '';
        if (alertTitleText.includes(MESSAGE_TO_CARE_TEAMS)) {
          value = `${MESSAGE_TO_CARE_TEAMS} FACILITY`;
        } else if (alertTitleText.includes(MULTIPLE_TEAMS_BLOCKED)) {
          value = `${alertTitleText}`;
        } else if (alertTitleText.includes(ALL_TEAMS_BLOCKED)) {
          value = alertTitleText;
        } else if (alertTitleText.includes(MESSAGE_TO_CARE_TEAM)) {
          value = `${MESSAGE_TO_CARE_TEAM} TG_NAME`;
        } else if (alertTitleText.includes(ACCOUNT_DISCONNECTED)) {
          value = `${ACCOUNT_DISCONNECTED} TG_NAME`;
        } else {
          value = alertTitleText;
        }
        datadogRum.addAction('Blocked triage group alert', { type: value });
        setIsAnalyticsSent(true);
      }
    },
    [showAlert, alertTitleText, isAnalyticsSent],
  );

  if (!showAlert) {
    return null;
  }

  return alertStyle === BlockedTriageAlertStyles.ALERT ? (
    <va-alert-expandable
      status="warning"
      trigger={alertTitleText}
      data-testid="blocked-triage-group-alert"
      data-dd-privacy="mask"
      data-dd-action-name="Blocked Triage Group Alert Expandable"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
        <p className="vads-u-margin-bottom--1p5">{alertInfoText}</p>
        {(parentComponent === ParentComponent.COMPOSE_FORM ||
          parentComponent === ParentComponent.CONTACT_LIST) &&
          !allTriageGroupsBlocked &&
          blockedTriageList?.length > 1 && (
            <ul>
              {blockedTriageList?.map((blockedTriageGroup, i) => (
                <li
                  data-testid="blocked-triage-group"
                  key={i}
                  data-dd-privacy="mask"
                  data-dd-action-name="Blocked/Not Associated alert - expandable"
                >
                  {`${
                    blockedTriageGroup.type === Recipients.FACILITY
                      ? 'Care teams at '
                      : ''
                  }${blockedTriageGroup.suggestedNameDisplay ||
                    blockedTriageGroup.name}`}
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
  ) : (
    <va-alert
      close-btn-aria-label="Close notification"
      status={alertStyle}
      visible
      data-testid="blocked-triage-group-alert"
    >
      <h2 slot="headline" data-dd-action-name="Blocked/Not Associated alert">
        {alertTitleText}
      </h2>
      <div>
        <p className="vads-u-margin-bottom--1p5">{alertInfoText}</p>
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
  blockedTriageGroupList: PropTypes.arrayOf(PropTypes.object),
  currentRecipient: PropTypes.object,
  isOhMessage: PropTypes.bool,
  parentComponent: PropTypes.string,
  setShowBlockedTriageGroupAlert: PropTypes.func,
};

export default BlockedTriageGroupAlert;
