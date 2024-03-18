import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { datadogRum } from '@datadog/browser-rum';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import {
  BlockedTriageAlertStyles,
  BlockedTriageAlertText,
  ParentComponent,
  RecipientStatus,
  Recipients,
} from '../../util/constants';
import { sortTriageList } from '../../util/helpers';

const BlockedTriageGroupAlert = props => {
  const { blockedTriageGroupList, alertStyle, parentComponent } = props;

  const { alertTitle, alertMessage } = BlockedTriageAlertText;
  const MESSAGE_TO_CARE_TEAM = "You can't send messages to";
  const MESSAGE_TO_CARE_TEAMS = "You can't send messages to care teams at";
  const ACCOUNT_DISCONNECTED = 'Your account is no longer connected to';

  const [alertTitleText, setAlertTitleText] = useState(
    alertTitle.NO_ASSOCIATIONS,
  );
  const [alertInfoText, setAlertInfoText] = useState(
    alertMessage.NO_ASSOCIATIONS,
  );

  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const { noAssociations, allTriageGroupsBlocked } = useSelector(
    state => state.sm.recipients,
  );

  const { blockedFacilities } = useSelector(state => state.sm.recipients);

  const blockedFacilityNames =
    blockedFacilities
      ?.filter(facility => getVamcSystemNameFromVhaId(ehrDataByVhaId, facility))
      .map(facility => {
        return {
          stationNumber: facility,
          name: getVamcSystemNameFromVhaId(ehrDataByVhaId, facility),
          type: Recipients.FACILITY,
        };
      }) || [];

  const blockedTriageList = useMemo(() => {
    return blockedTriageGroupList?.length > 1 && blockedFacilityNames.length > 0
      ? [
          ...sortTriageList(
            blockedTriageGroupList.filter(
              triageGroup =>
                !blockedFacilityNames?.some(
                  facilityName =>
                    facilityName.stationNumber === triageGroup.stationNumber,
                ),
            ),
          ),
          ...sortTriageList(blockedFacilityNames),
        ]
      : sortTriageList(blockedTriageGroupList);
  }, []);

  useEffect(
    () => {
      if (alertTitleText !== alertTitle.NO_ASSOCIATIONS) {
        let value = '';
        if (alertTitleText.includes(MESSAGE_TO_CARE_TEAMS)) {
          value = `${MESSAGE_TO_CARE_TEAMS} FACILITY`;
        } else if (alertTitleText.includes(MESSAGE_TO_CARE_TEAM)) {
          value = `${MESSAGE_TO_CARE_TEAM} TG_NAME`;
        } else if (alertTitleText.includes(ACCOUNT_DISCONNECTED)) {
          value = `${ACCOUNT_DISCONNECTED} TG_NAME`;
        } else {
          value = alertTitleText;
        }
        datadogRum.addAction('Blocked triage group alert', { type: value });
      }
    },
    [alertTitle.NO_ASSOCIATIONS, alertTitleText],
  );

  useEffect(() => {
    if (parentComponent === ParentComponent.FOLDER_HEADER) {
      if (noAssociations) {
        return;
      }

      if (allTriageGroupsBlocked) {
        setAlertTitleText(alertTitle.ALL_TEAMS_BLOCKED);
        setAlertInfoText(alertMessage.ALL_TEAMS_BLOCKED);
        return;
      }
    }

    if (parentComponent === ParentComponent.COMPOSE_FORM) {
      if (noAssociations) {
        return;
      }

      if (allTriageGroupsBlocked) {
        setAlertTitleText(alertTitle.ALL_TEAMS_BLOCKED);
        setAlertInfoText(alertMessage.ALL_TEAMS_BLOCKED);
        return;
      }
    }

    if (blockedTriageList?.length === 1) {
      if (blockedTriageList[0].type === Recipients.FACILITY) {
        setAlertTitleText(
          `${MESSAGE_TO_CARE_TEAMS} ${blockedTriageList[0].name}`,
        );
        setAlertInfoText(alertMessage.SINGLE_FACILITY_BLOCKED);
      } else {
        setAlertTitleText(
          blockedTriageList[0].status === RecipientStatus.NOT_ASSOCIATED
            ? `${ACCOUNT_DISCONNECTED} ${blockedTriageList[0].name}`
            : `${MESSAGE_TO_CARE_TEAM} ${blockedTriageList[0].name}`,
        );
        if (blockedTriageList[0].status === RecipientStatus.BLOCKED) {
          setAlertInfoText(alertMessage.SINGLE_TEAM_BLOCKED);
        }
      }
    } else {
      setAlertTitleText(alertTitle.MULTIPLE_TEAMS_BLOCKED);
      setAlertInfoText(alertMessage.MULTIPLE_TEAMS_BLOCKED);
    }
  }, []);

  return alertStyle === BlockedTriageAlertStyles.ALERT ? (
    <va-alert-expandable
      status="warning"
      trigger={alertTitleText}
      data-testid="blocked-triage-group-alert"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
        <p className="vads-u-margin-bottom--1p5">{alertInfoText}</p>
        {parentComponent === ParentComponent.COMPOSE_FORM &&
          !allTriageGroupsBlocked &&
          blockedTriageList?.length > 1 && (
            <ul>
              {blockedTriageList?.map((blockedTriageGroup, i) => (
                <li data-testid="blocked-triage-group" key={i}>
                  {`${
                    blockedTriageGroup.type === Recipients.FACILITY
                      ? 'Care teams at '
                      : ''
                  }${blockedTriageGroup.name}`}
                </li>
              ))}
            </ul>
          )}
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert-expandable>
  ) : (
    <va-alert
      close-btn-aria-label="Close notification"
      status={alertStyle}
      visible
      data-testid="blocked-triage-group-alert"
    >
      <h2 slot="headline">{alertTitleText}</h2>
      <div>
        <p className="vads-u-margin-bottom--1p5">{alertInfoText}</p>
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert>
  );
};

BlockedTriageGroupAlert.propTypes = {
  alertStyle: PropTypes.string,
  blockedTriageGroupList: PropTypes.arrayOf(PropTypes.object),
  parentComponent: PropTypes.string,
};

export default BlockedTriageGroupAlert;
