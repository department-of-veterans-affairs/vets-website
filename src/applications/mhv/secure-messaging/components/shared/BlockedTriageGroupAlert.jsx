import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const BlockedTriageGroupAlert = props => {
  const { blockedTriageList } = props;
  const [careTeamTitleText, setCareTeamTitleText] = useState(
    'certain providers',
  );
  const [multipleGroupsText, setMultipleGroupsText] = useState(
    'these care teams',
  );

  useEffect(
    () => {
      if (blockedTriageList.length === 1) {
        setCareTeamTitleText(blockedTriageList[0].name);
        setMultipleGroupsText('this care team');
      }
    },
    [blockedTriageList],
  );

  return (
    <va-alert-expandable
      status="warning"
      trigger={`You can't send messages to ${careTeamTitleText}`}
      data-testid="blocked-triage-group-alert"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
        {blockedTriageList.length > 1 && (
          <ul>
            {blockedTriageList.map((blockedTriageGroup, i) => (
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
  );
};

BlockedTriageGroupAlert.propTypes = {
  blockedTriageList: PropTypes.arrayOf(PropTypes.object),
};

export default BlockedTriageGroupAlert;
