import React from 'react';
import { useOutletContext } from 'react-router-dom-v5-compat';

import Issues from '../components/appeals-v2/Issues';
import { APPEAL_TYPES, addStatusToIssues } from '../utils/appeals-v2-helpers';

export default function AppealsV2DetailPage() {
  const [appeal] = useOutletContext();
  const issues = addStatusToIssues(appeal.attributes.issues);
  const isAppeal =
    appeal.type === APPEAL_TYPES.appeal || appeal.type === APPEAL_TYPES.legacy;

  return (
    <div id="tabPanelv2detail">
      <Issues issues={issues} isAppeal={isAppeal} />
    </div>
  );
}

AppealsV2DetailPage.propTypes = {};
