import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const BlockedTriageGroupAlert = props => {
  const { blockedTriageList, status } = props;
  const [careTeamTitleText, setCareTeamTitleText] = useState(
    'certain providers',
  );
  const [multipleGroupsText, setMultipleGroupsText] = useState(
    'these care teams',
  );

  useEffect(
    () => {
      if (blockedTriageList?.length === 1) {
        setCareTeamTitleText(blockedTriageList[0].name);
        setMultipleGroupsText('this care team');
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
                {blockedTriageGroup.name}
              </li>
            ))}
          </ul>
        )}
        <p className="vads-u-margin-bottom--1p5">
          If you need help contacting {multipleGroupsText}, call your VA health
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
          If you need to contact your care tam, call your VA health facility.
        </p>
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert>
  );
};

BlockedTriageGroupAlert.propTypes = {
  blockedTriageList: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.string,
};

export default BlockedTriageGroupAlert;
