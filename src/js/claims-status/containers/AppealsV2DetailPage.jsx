import React from 'react';
import Issues from '../components/appeals-v2/Issues';
import { categorizeIssues } from '../utils/appeals-v2-helpers';

const AppealsV2DetailPage = ({ appeal }) => {
  const issues = categorizeIssues(appeal.attributes.issues);
  return (
    <div>
      <Issues issues={issues}/>
    </div>
  );
};

export default AppealsV2DetailPage;
