import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BlockedTriageGroupAlert = () => {
  const { recipients } = useSelector(state => state.sm);
  const [careTeamTitleText, setCareTeamTitleText] = useState(
    'certain providers',
  );

  useEffect(
    () => {
      if (recipients.associatedBlockedTriageGroupsQty === 1) {
        setCareTeamTitleText(recipients.blockedRecipients[0].name);
      }
    },
    [recipients],
  );

  return (
    <va-alert-expandable
      status="warning"
      trigger={`You can't send messages to ${careTeamTitleText}`}
      data-testid="blocked-triage-group-alert"
    >
      <div className="vads-u-padding-left--4 vads-u-padding-bottom--1">
        {recipients.associatedBlockedTriageGroupsQty > 1 && (
          <ul>
            {recipients.blockedRecipients.map((blockedTriageGroup, i) => (
              <li data-testid="blocked-triage-group" key={i}>
                {blockedTriageGroup.name}
              </li>
            ))}
          </ul>
        )}
        <p className="vads-u-margin-bottom--1p5">
          If you need help contacting this care team, call your VA health
          facility.
        </p>
        <a href="/find-locations/">Find your VA health facility</a>
      </div>
    </va-alert-expandable>
  );
};

export default BlockedTriageGroupAlert;
