import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { ParentComponent, Recipients } from '../../util/constants';

const BlockedTriageGroupAlert = props => {
  const { blockedTriageGroupList, status, parentComponent } = props;
  const [careTeamTitleText, setCareTeamTitleText] = useState(
    'certain providers',
  );
  const [multipleGroupsText, setMultipleGroupsText] = useState(
    'these care teams',
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
      parentComponent === ParentComponent.COMPOSE_FORM &&
      associatedTriageGroupsQty > 0 &&
      associatedTriageGroupsQty === associatedBlockedTriageGroupsQty
    ) {
      setCareTeamTitleText('your care teams right now');
      setMultipleGroupsText('your care teams');
    } else if (blockedTriageList?.length === 1) {
      setCareTeamTitleText(blockedTriageList[0].name);
      if (blockedTriageList[0].type === Recipients.CARE_TEAM) {
        setMultipleGroupsText('this care team');
      } else {
        setCareTeamTitleText(`care teams at ${blockedTriageList[0].name}`);
        setMultipleGroupsText('these care teams');
      }
    }
  }, []);

  return status === 'alert' ? (
    <va-alert-expandable
      status="warning"
      trigger={`You can't send messages to ${careTeamTitleText}`}
      data-testid="blocked-triage-group-alert"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
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
        <p className="vads-u-margin-bottom--1p5">
          If you need to contact {multipleGroupsText}, call your VA health
          facility.
        </p>
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert-expandable>
  ) : (
    <va-alert
      close-btn-aria-label="Close notification"
      status={status}
      visible
      data-testid="blocked-triage-group-alert"
    >
      <h2 id="track-your-status-on-mobile" slot="headline">
        {`${
          status === 'info'
            ? 'You’re not connected to any care teams in this messaging tool'
            : "You can't send messages to your care teams right now."
        }`}
      </h2>
      <div>
        <p className="vads-u-margin-bottom--1p5">
          {`${
            status === 'info'
              ? 'If you need to contact your care team, call your VA health facility.'
              : 'If you need to contact your care teams, call your VA health facility.'
          }`}
        </p>
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert>
  );
};

BlockedTriageGroupAlert.propTypes = {
  blockedTriageGroupList: PropTypes.arrayOf(PropTypes.object),
  parentComponent: PropTypes.string,
  status: PropTypes.string,
};

export default BlockedTriageGroupAlert;
