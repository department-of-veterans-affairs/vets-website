import React from 'react';
import { useOutletContext } from 'react-router-dom-v5-compat';

import Issues from '../components/appeals-v2/Issues';
import { getTypeName, addStatusToIssues } from '../utils/appeals-v2-helpers';

export default function AppealsV2DetailPage() {
  const [appeal] = useOutletContext();
  const issues = addStatusToIssues(appeal.attributes.issues);
  const appealType = getTypeName(appeal);

  return (
    <div id="tabPanelv2detail">
      <Issues issues={issues} appealType={appealType} />
    </div>
  );
}

AppealsV2DetailPage.propTypes = {};
