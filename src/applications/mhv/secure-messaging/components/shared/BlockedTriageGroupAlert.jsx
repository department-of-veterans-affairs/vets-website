import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { Recipients } from '../../util/constants';

const BlockedTriageGroupAlert = props => {
  const { blockedTriageGroupList, status } = props;
  const [careTeamTitleText, setCareTeamTitleText] = useState(
    'certain providers',
  );
  const [multipleGroupsText, setMultipleGroupsText] = useState(
    'these care teams',
  );

  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData.vamcEhrData.data.ehrDataByVhaId,
  );

  const { blockedFacilities } = useSelector(state => state.sm.recipients);

  const blockedFacilityNames = blockedFacilities?.map(facility => {
    return {
      stationNumber: facility,
      name: getVamcSystemNameFromVhaId(ehrDataByVhaId, facility),
      type: Recipients.FACILITY,
    };
  });

  const blockedTriageList = useMemo(() => {
    return blockedTriageGroupList.length > 1
      ? [
          ...blockedTriageGroupList.filter(
            triageGroup =>
              !blockedFacilities.includes(triageGroup.stationNumber),
          ),
          ...blockedFacilityNames,
        ]
      : blockedTriageGroupList;
  }, []);

  useEffect(
    () => {
      if (blockedTriageList?.length === 1) {
        setCareTeamTitleText(blockedTriageList[0].name);
        if (blockedTriageList[0].type === Recipients.CARE_TEAM) {
          setMultipleGroupsText('this care team');
        } else {
          setCareTeamTitleText(`care teams at ${blockedTriageList[0].name}`);
          setMultipleGroupsText('these care teams');
        }
      }
    },
    [blockedTriageList],
  );

  return status === 'alert' ? (
    <va-alert-expandable
      status="warning"
      trigger={`You can't send messages to ${careTeamTitleText}`}
      data-testid="blocked-triage-group-alert"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
        {blockedTriageList?.length > 1 && (
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
      status="info"
      visible
      data-testid="blocked-triage-group-alert"
    >
      <h2 id="track-your-status-on-mobile" slot="headline">
        You’re not connected to any care teams in this messaging tool
      </h2>
      <div>
        <p className="vads-u-margin-bottom--1p5">
          If you need to contact your care team, call your VA health facility.
        </p>
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert>
  );
};

BlockedTriageGroupAlert.propTypes = {
  blockedTriageGroupList: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.string,
};

export default BlockedTriageGroupAlert;
