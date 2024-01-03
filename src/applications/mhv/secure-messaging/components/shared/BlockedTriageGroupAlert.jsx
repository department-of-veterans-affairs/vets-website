import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import {
  ParentComponent,
  RecipientStatus,
  Recipients,
} from '../../util/constants';

const BlockedTriageGroupAlert = props => {
  const { blockedTriageGroupList, alertStyle, parentComponent } = props;
  const [alertTitleText, setAlertTitleText] = useState(
    "You're not connected to any care teams in this messaging tool",
  );
  const [alertInfotText, setAlertInfoText] = useState(
    'If you need to contact your care team, call your VA health facility.',
  );

  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData.vamcEhrData.data.ehrDataByVhaId,
  );

  const {
    associatedTriageGroupsQty,
    associatedBlockedTriageGroupsQty,
  } = useSelector(state => state.sm.recipients);

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
          ...blockedTriageGroupList
            .filter(
              triageGroup =>
                !blockedFacilityNames?.some(
                  facilityName =>
                    facilityName.stationNumber === triageGroup.stationNumber,
                ),
            )
            ?.sort((a, b) => a.name.localeCompare(b.name)),
          ...blockedFacilityNames?.sort((a, b) => a.name.localeCompare(b.name)),
        ]
      : blockedTriageGroupList;
  }, []);

  useEffect(() => {
    if (
      parentComponent === ParentComponent.FOLDER_HEADER &&
      associatedTriageGroupsQty === 0
    ) {
      return;
    }

    if (
      parentComponent === ParentComponent.COMPOSE_FORM &&
      associatedTriageGroupsQty === associatedBlockedTriageGroupsQty
    ) {
      if (associatedTriageGroupsQty > 0) {
        setAlertTitleText(
          "You can't send messages to your care teams right now",
        );
        setAlertInfoText(
          'If you need to contact your care teams, call your VA health facility',
        );
      }
      return;
    }

    if (blockedTriageList.length === 1) {
      if (blockedTriageList[0].type === Recipients.FACILITY) {
        setAlertTitleText(
          `You can't send messages to care teams at ${
            blockedTriageList[0].name
          }`,
        );
        setAlertInfoText(
          'If you need to contact these care teams, call the facility',
        );
      } else {
        setAlertTitleText(
          blockedTriageList[0].status === RecipientStatus.NOT_ASSOCIATED
            ? `Your account is no longer connected to ${
                blockedTriageList[0].name
              }`
            : `You can't send messages to ${blockedTriageList[0].name}`,
        );
        if (blockedTriageList[0].status === RecipientStatus.BLOCKED) {
          setAlertInfoText(
            'If you need to contact this care team, call your VA health facility',
          );
        }
      }
    } else {
      setAlertTitleText("You can't send messages to some of your care teams");
      setAlertInfoText(
        'If you need to contact these care teams, call your VA health facility',
      );
    }
  }, []);

  return alertStyle === 'alert' ? (
    <va-alert-expandable
      status="warning"
      trigger={alertTitleText}
      data-testid="blocked-triage-group-alert"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
        <p className="vads-u-margin-bottom--1p5">{alertInfotText}</p>
        {parentComponent === ParentComponent.COMPOSE_FORM &&
          associatedTriageGroupsQty !== associatedBlockedTriageGroupsQty &&
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
        <p className="vads-u-margin-bottom--1p5">{alertInfotText}</p>
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
